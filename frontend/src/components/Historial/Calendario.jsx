import * as React from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import styled from "styled-components";
const Estilo = styled.div`
  .MuiDateCalendar-root .Mui-disabled {
    color: black !important;
    opacity: 1 !important;
  }
`;

//esto es lo que carga los iconos
function fakeFetch(diasUnicos, date, { signal }) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      resolve({ daysToHighlight: diasUnicos });
    }, 500);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException("aborted", "AbortError"));
    };
  });
}

const initialValue = dayjs();

function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth &&
    highlightedDays.indexOf(props.day.date()) >= 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? "🏋️‍♂️" : undefined}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

//este el propio componetne, donde pasamos las props
export default function DateCalendarServerRequest(props) {
  const { diasUnicos } = props;
  const requestAbortController = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([]);

  //renderizas los dias a marcar, llamando a la funcion de antes
  const fetchHighlightedDays = (date) => {
    const controller = new AbortController();
    fakeFetch(diasUnicos, date, {
      signal: controller.signal,
    })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        // ignore the error if it's caused by `controller.abort`
        if (error.name !== "AbortError") {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

  //al cargar actualiza el estado de los dias a marcascon unos valores iniciales
  React.useEffect(() => {
    fetchHighlightedDays(initialValue);
    // abort request on unmount
    return () => requestAbortController.current?.abort();
  }, []);

  //cuando cambie el mes se vuelven a cargar los dias a marcar
  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  //localizationProvider establece que los dias los vamos a establecer con dayjs y ademas el idioma
  //se pasan diferentes atributos para pasar los valores de los dias a marcar
  return (
    <Estilo>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <DateCalendar
          sx={{
            backgroundColor: "#e3d5bb",
          }}
          defaultValue={initialValue}
          loading={isLoading}
          onMonthChange={handleMonthChange}
          renderLoading={() => <DayCalendarSkeleton />}
          slots={{
            day: ServerDay,
          }}
          slotProps={{
            day: {
              highlightedDays,
            },
          }}
          language="es"
        />
      </LocalizationProvider>
    </Estilo>
  );
}
