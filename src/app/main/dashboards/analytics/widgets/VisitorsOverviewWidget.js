import { useSelector, useDispatch } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { selectContrastMainTheme } from 'app/store/fuse/settingsSlice';
import Paper from '@mui/material/Paper';
import {
  selectWidgets,
  setExportedData,
  setExportedSummaryInfo,
  getWidgets,
  getVariables,
  getMonthData,
} from '../store/widgetsSlice';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import SummaryInfo from '../../components/SummaryInfo';
import moment from 'moment-timezone';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button, IconButton } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import * as XLSX from 'xlsx';
import Alert from '@mui/material/Alert';
import FuseLoading from '@fuse/core/FuseLoading';
import { initOnLoad } from 'apexcharts';

const Root = styled(Paper)(({ theme }) => ({
  //background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const CapaCarga = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  zIndex: 1000,
});

function VisitorsOverviewWidget() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const contrastTheme = useSelector(selectContrastMainTheme(theme.palette.primary.main));
  //const widgets = useSelector(selectWidgets);
  const [series, setSeries] = useState([]);
  const [chartReady, setChartReady] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString()); //
  const [selectedMonth, setSelectedMonth] = useState('Todos'); // Para almacenar el mes seleccionado
  const [data, setData] = useState([]);
  const monthsOfYearRef = useRef([]);
  const monthsOfYear = monthsOfYearRef.current;
  const currentYear = new Date().getFullYear();
  const [loading, setLoading] = useState(false);

  // Opciones del select para el año actual y el año anterior
  const yearOptions = [
    /*  { value: currentYear, label: currentYear.toString() },
    { value: previousYear, label: previousYear.toString() }, */
    { value: 2023, label: '2023' },
    { value: 2024, label: '2024' },
  ];

  const [selectedMonthDays, setSelectedMonthDays] = useState([]);

  const chartOptions = {
    chart: {
      height: 300,
      type: 'area',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
        export: {
          csv: {
            filename: selectedMonth !== 'Todos' ? `Filtro: ${selectedYear} - ${selectedMonth}` : 'Todos los registros',
          },
        },
      },
    },

    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      // Update the categories dynamically based on selectedYear and selectedMonth
      categories: selectedMonth === 'Todos' ? monthsOfYearRef.current.slice(1) : selectedMonthDays,
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          // Formateo para separación de miles
          return value.toLocaleString('es-ES');
        },
      },
    },
    title: {
      text: 'Ventas',
      align: 'left',
      margin: 30,
      offsetY: -10,
      style: {
        fontSize: '18px',
        color: 'black',
        fontWeight: 'normal',
      },
    },

    tooltip: {
      y: {
        formatter: function (value) {
          // Formatear el valor con separadores de miles
          return value.toLocaleString('es-ES');
        },
      },
    },
  };

  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  //genera los meses en el select
  const generateMonths = (selectedYear) => {
    const months = [];
    if (selectedYear == currentYear) {
      // Para el año actual, muestra solo los meses hasta el mes actual
      const currentMonth = new Date().getMonth();
      for (let i = 0; i <= currentMonth; i++) {
        months.push(monthNames[i]);
      }
    } else {
      // Para otros años, muestra todos los meses (12 meses)
      for (let i = 0; i <= 11; i++) {
        months.push(monthNames[i]);
      }
    }
    monthsOfYearRef.current = ['Todos', ...months];
  };

  const [selectedChannel, setSelectedChannel] = useState('todos');
  const [selectedGec, setSelectedGec] = useState('TODOS');
  const [gecs, setGecs] = useState(['TODOS']);

  const [openAlert, setAlert] = useState({
    msg: '',
    alert: '',
  });
  const [storedData, setStoredData] = useState([]);

  const handleSelectChannel = (value) => {
    setSelectedChannel(value);
    const channel = channels.find((item) => item.canal.toLowerCase() === value);
    const gecList = channel ? channel.gec : [];
    setGecs(gecList);
  };

  const [channels, setChannels] = useState([]);
  const channelOptions = channels.map((channel) => {
    return { label: channel.canal, value: channel.canal?.toLowerCase() };
  });

  useEffect(() => {
    dispatch(getVariables()).then((res) => {
      setChannels(res.payload.channels);
    });
  }, [dispatch]);

  useEffect(() => {
    generateMonths(selectedYear);
  }, []);

  // Define una función para manejar la actualización del estado con el valor filtrado
  const updateStateWithFilteredData = (filteredData) => {
    dispatch(setExportedData(filteredData));
  };

  const handleFilters = async (isInitialLoad = false) => {
    setAlert({ msg: '', alert: true });
    setLoading(true);

    const queryParams = {
      year: selectedYear,
      channel: selectedChannel !== 'todos' ? selectedChannel.toUpperCase() : undefined,
      month: selectedMonth !== 'Todos' ? monthNames.findIndex((month) => month === selectedMonth) + 1 : undefined,
      group: selectedGec !== 'TODOS' ? selectedGec : undefined,
    };

    // Eliminar parametros undefined
    Object.keys(queryParams).forEach((key) => queryParams[key] === undefined && delete queryParams[key]);

    try {
      const response = await dispatch(getMonthData(queryParams));
      const data = response.payload;

      setData(data);
      setSeries([{ name: selectedMonth, data: data.panel?.map((item) => item.qty) || [], color: '#ffb45c' }]);

      if (isInitialLoad) {
        setStoredData(data);
      }

      if (selectedMonth !== 'Todos') {
        setSelectedMonthDays(data.panel?.map((item) => item.day) || []);
      }
      setChartReady(true);
    } catch (error) {
      setAlert({ msg: 'Se produjo un error al obtener los datos, limpie los filtros', alert: false });
    } finally {
      setLoading(false);
      setChartReady(true);
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setSelectedMonth('Todos');
    generateMonths(event.target.value);
  };

  // Actualiza la función de manejo de cambio de mes

  const handleMonthChange = (event) => {
    const selectedMonth = event.target.value;
    setSelectedMonth(selectedMonth);
  };

  const handleGecChange = (event) => {
    const selectedGec = event.target.value;
    setSelectedGec(selectedGec);
  };
  const handleCleanButton = () => {
    setSelectedMonth('Todos');
    setSelectedChannel('todos');
    setSelectedGec('TODOS');
    setAlert(true);
    if (storedData) {
      // Usar los datos guardados para actualizar el grafico
      setData(storedData);
      setSeries([{ name: 'Todos los meses', data: storedData.panel?.map((item) => item.qty) || [], color: '#ffb45c' }]);
      setChartReady(true);
    }
  };

  // const exportedData = widgets.exportedData;
  //const exportedSummaryInfo = widgets.exportedSummaryInfo;

  const handleExportData = () => {
    const workbook = XLSX.utils.book_new();
    const sheets = [
      {
        name: 'Ventas',
        data: exportedData,
      },
      {
        name: 'Resumen',
        data: [
          {
            total: exportedSummaryInfo.total,
            clientes_compra: exportedSummaryInfo.clientes_compra,
            efectidad: exportedSummaryInfo.efectidad,
            cobertura: exportedSummaryInfo.cobertura,
            compra_promedio_drop: exportedSummaryInfo.compra_promedio.drop,
            compra_promedio_ref: exportedSummaryInfo.compra_promedio.ref,
            compra_promedio_frec: exportedSummaryInfo.compra_promedio.frec,
          },
        ],
      },
    ];

    sheets.forEach((sheet) => {
      const worksheet = XLSX.utils.json_to_sheet(sheet.data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
    });

    // Guardar el archivo
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'data.xlsx');
  };

  // Cargar datos del año en curso
  useEffect(() => {
    handleFilters(true);
  }, []);

  return (
    <>
      <div
        className="flex flex-row mb-20 items-strech"
        style={{ backgroundColor: 'white', justifyContent: 'space-between', borderRadius: '10px' }}>
        <div className="flex flex-row items-strech">
          <div className="flex items-center mr-4"></div>
          <Box sx={{ m: 1, minWidth: 150 }} size="small" className="flex flex-col">
            <InputLabel id="year-select-label" className="mb-1 text-xs">
              Año
            </InputLabel>
            <Select
              labelId="year-select-label"
              value={selectedYear}
              onChange={handleYearChange}
              color="secondary"
              size="small">
              {yearOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ m: 1, minWidth: 90 }} size="small" className="flex flex-col">
            <InputLabel id="month-select-label" className="mb-1 text-xs">
              Mes
            </InputLabel>
            <Select
              labelId="month-select-label"
              value={selectedMonth}
              onChange={handleMonthChange}
              color="secondary"
              size="small">
              {monthsOfYear.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ m: 1, minWidth: 100 }} size="small" className="flex flex-col">
            <InputLabel id="channel-select-label" className="mb-1 text-xs">
              Canal
            </InputLabel>
            <Select
              labelId="channel-select-label"
              sx={{ maxWidth: '100%', width: '100%' }}
              value={selectedChannel}
              onChange={(event) => handleSelectChannel(event.target.value)}
              color="secondary"
              size="small">
              {channelOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ m: 1, minWidth: 100 }} size="small" className="flex flex-col">
            <InputLabel id="gec-select-label" className="mb-1 text-xs">
              GEC
            </InputLabel>
            <Select
              labelId="gec-select-label"
              sx={{ maxWidth: '100%', width: 150 }}
              value={selectedGec}
              onChange={(event) => handleGecChange(event)}
              color="secondary"
              size="small">
              {gecs.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box size="small" className="flex flex-row items-center ml-2 ">
            <Button
              className="custom-button mt-14"
              variant="contained"
              component="label"
              color="primary"
              onClick={() => handleFilters(false)}>
              Aplicar filtros
            </Button>
          </Box>

          <Box size="small" className="flex flex-row items-center ml-2">
            <IconButton aria-label="delete" onClick={handleCleanButton} className="mt-14">
              <FilterAltOffIcon />
            </IconButton>
          </Box>
        </div>
      </div>
      {openAlert.alert === false ? <Alert severity="error">{openAlert.msg}</Alert> : null}
      <Root className="flex flex-row flex-auto shadow rounded-2xl overflow-hidden">
        <div style={{ flex: 1 }}>
          <div className="flex flex-col flex-auto h-320 mt-20" style={{ color: 'black' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <div className="flex flex-col flex-auto h-320 mt-20" style={{ color: 'black' }}>
                {!loading && chartReady && series.length > 0 && (
                  <ReactApexChart
                    options={chartOptions}
                    series={series}
                    type={chartOptions.chart.type}
                    height={chartOptions.chart.height}
                  />
                )}
                {loading && (
                  <CapaCarga>
                    <FuseLoading />
                  </CapaCarga>
                )}
              </div>
            </div>
          </div>
        </div>
        <SummaryInfo summaryInfoData={data} />
      </Root>
    </>
  );
}

export default VisitorsOverviewWidget;
