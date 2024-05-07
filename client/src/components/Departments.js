import React, { useEffect, useState } from "react";

//kokeile importtaa kaikki kerrallaan
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function Departments({ departmentsProps }) {

  return (
    <div className='employeesanddepartments'>
      <h4>Departments</h4>
      <TableContainer
        component={Paper}
      >
        <Table sx={{ minWidth: 650 }} arial-label='simple table' size="small">
          <TableHead>
            <TableRow>
              <TableCell align='right'>Name</TableCell>
              <TableCell align='right'>Field</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(departmentsProps).map(([key, department]) => (
              <TableRow
                key={key}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component='th' scope='row'>{department.name}</TableCell>
                <TableCell>{department.field}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )

}