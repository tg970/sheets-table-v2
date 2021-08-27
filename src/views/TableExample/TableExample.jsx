/*eslint-disable*/
import React, { useEffect, useState, forwardRef }  from "react";

import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

import network from "../../utils/network.js";

const testSheet = "1O3Xbi2UiwvBY91tlYUpR78-4r9rMFZjFF3E1JTnIowY"

const prodSheet = "15xYUaZiqCuEl2luDf2sa-omWfCEFUvLzL7cXwU2Cn5s"

const staticUrl = (sheetId) => {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
}



const rowResolver = (row, cols) => {
  const data = row.c;
  let newRow = {};
  data.forEach((item, index) => {
    if (!item || !item.v || !cols[index]) return;
    newRow[cols[index].field] = item.v
  })
  return newRow;
}

function TableExample({...props}){
  const { classes, ...rest } = props;

  const [state, setState] = useState({
    loaded: false,
    columns: [],
    data: []
  })

  const dataProcessor = (data) => {
    const json = JSON.parse(data.substr(47).slice(0, -2));

    console.log(json.table.rows);

    let cols = [];

    json.table.rows[0].c.forEach((item) => {
      if (!item || !item.v) return
      cols.push({
        title: item.v,
        field: item.v
      })
    });

    console.log(cols);

    let rows = json.table.rows.slice(1).map((i) => rowResolver(i, cols));

    console.log(rows);

    setState({
      loaded: true,
      columns: cols,
      data: rows,
    })

  }

  useEffect(() => {
    if (!state.loaded) network.get(staticUrl(prodSheet), dataProcessor)
  });

  return (
    <div
      className={classes.innerWrap}
    >
      {state.loaded && <MaterialTable
        icons={tableIcons}
        isLoading={!state.loaded}
        title="רשימת חנויות"
        columns={state.columns || []}
        data={state.data || []}
        localization={{
          toolbar: {
            searchPlaceholder: "חיפוש",
            searchTooltip: "חיפוש",
          },
          pagination: {
            labelDisplayedRows: "{count} מתוך {to}-{from}",
            labelRowsSelect: "שורות",
            labelRowsPerPage: "שורות לעמוד:",
            firstAriaLabel: "עמוד ראשון",
            firstTooltip: "עמוד ראשון",
            previousAriaLabel: "עמוד קודם",
            previousTooltip: "עמוד קודם",
            nextAriaLabel: "עמוד הבא",
            nextTooltip: "עמוד הבא",
            lastAriaLabel: "עמוד אחרון",
            lastTooltip: "עמוד אחרון"
          }
        }}
        options={{
          pageSize: state.data.length,
          pageSizeOptions: [10, 20, 80, 100, 200, state.data.length],
          padding: 'dense',
          headerStyle: {
            backgroundColor: "#97C7D3",
            color: '#FFF',
            textAlign: 'right',
            flexDirection: "row-reverse",
          },
          cellStyle: {
            textAlign: 'right',
          },
        }}
      />}
    </div>
  );
}

const styles = {
  innerWrap: {
    // maxHeight: '90vh',
    overflow: 'auto',
    "& .MuiToolbar-root": {
      flexDirection: "row-reverse",
    },
    "& h6": {
      paddingRight: "7px",
    },
    "& .MuiInput-underline:after" : {
      borderBottom: '2px solid #97C7D3',
    },
    "@media (max-width: 475px)": {
      "& td,th": {
        fontSize: "12px",
        paddingRight: "2px",
        paddingLeft: 0,
      },
      "& th": {
        paddingTop: "3px",
        paddingBottom: "3px",
      },
      "& h6": {
        fontSize: "14px",
      },
      "& .MuiFormControl-root": {
        paddingLeft: 0,
      },
      "& .MuiInput-root": {
        fontSize: "12px",
      },
      "& .MuiIcon-root": {
        height: "0.75em",
        width: "0.75em",
      }
    }
  }
}


TableExample.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(TableExample);
