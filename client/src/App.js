import React, { useState, useEffect } from 'react';
import './App.css';
import {
	Jumbotron,
	MDBContainer,
	MDBTable,
	MDBTableHead,
	MDBTableBody,
	MDBBtn,
	MDBIcon,
	MDBInput,
} from 'mdbreact';

import axios from 'axios';

function App() {
	// const employeeData = [
	// 	{
	// 		fullName: 'Andrew Levine',
	// 		DOB: '03/08/1990',
	// 		role: 'Front End Engineer',
	// 		id: 'b1677a5b-56bd-410e-a22f-535aee7b972a',
	// 	},
	// 	{
	// 		fullName: 'Corey Schram',
	// 		DOB: '04/18/1991',
	// 		role: 'Front End Engineer',
	// 		id: 'ba3363ef-ffe3-46e4-af22-2a06f0acbf0a',
	// 	},
	// 	{
	// 		fullName: 'Taylor Smith',
	// 		DOB: '08/04/1987',
	// 		role: 'Front End Engineer',
	// 		id: 'd61e486b-c4ef-4a68-8f82-6abef6e09079',
	// 	},
	// 	{
	// 		fullName: 'Aaron Dack',
	// 		DOB: '11/11/1993',
	// 		role: 'Front End Engineer',
	// 		id: '99137fce-11bb-4b0b-9461-9e935b69feb8',
	// 	},
	// 	{
	// 		fullName: 'John Guy',
	// 		DOB: '01/02/03',
	// 		role: 'Dude Guy',
	// 		id: 'ebcfd312-7f28-4d44-8891-e2b399fa8b58',
	// 	},
	// ];

	useEffect(async () => {
		const res = await axios.get('http://localhost:5000/employees');
		setEmployees(res.data);
	}, []);

	const [employees, setEmployees] = useState([]);

	const [inEditMode, setInEditMode] = useState(false);
	const [newEmployee, setNewEmployee] = useState({
		fullName: '',
		DOB: '',
		role: '',
	});

	const onChange = (e) => {
		setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
	};

	const { fullName, DOB, role } = newEmployee;

	const onAddEmployee = async () => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		if (inEditMode) {
			const editingEmployee = {
				fullName: newEmployee.fullName,
				DOB: newEmployee.DOB,
				role: newEmployee.role,
			};
			const res = await axios.put(
				`http://localhost:5000/employees/${newEmployee.id}`,
				editingEmployee,
				config
			);
			setEmployees((employees) =>
				employees.map((e) => (e.id === newEmployee.id ? res.data : e))
			);

			setInEditMode(false);
		} else {
			const res = await axios.post(
				`http://localhost:5000/employees`,
				newEmployee,
				config
			);
			setEmployees([...employees, res.data]);
		}
		setNewEmployee({
			fullName: '',
			DOB: '',
			role: '',
		});
	};

	const selectEditMode = (employee) => {
		setNewEmployee(employee);
		setInEditMode(true);
	};

	const selectAddMode = () => {
		setNewEmployee({
			fullName: '',
			DOB: '',
			role: '',
		});
		setInEditMode(false);
	};

	const onDeleteEmployee = async (id) => {
		const res = await axios.delete(`http://localhost:5000/employees/${id}`);
		setEmployees((employees) => employees.filter((e) => e.id !== id));
	};

	return (
		<MDBContainer className='my-5'>
			<Jumbotron>
				<h1 className='jumbo-heading'>Employees</h1>
				<div className='jumbo-body'>
					<MDBTable>
						<MDBTableHead>
							<tr>
								<th>Full Name</th>
								<th className='text-center'>DOB</th>
								<th className='text-center'>Role</th>
								<th>									
								</th>
							</tr>
						</MDBTableHead>
						<MDBTableBody>
							<tr>
								<td>
									<input
										type='text'
										name='fullName'
										className='form-control'
										maxLength='255'
										validate
										required
										value={fullName}
										onChange={onChange}
									/>
								</td>
								<td>
									<input
										type='text'
										name='DOB'
										className='form-control'
										maxLength='255'
										validate
										required
										value={DOB}
										onChange={onChange}
									/>
								</td>
								<td>
									<input
										type='text'
										name='role'
										className='form-control'
										maxLength='255'
										validate
										required
										value={role}
										onChange={onChange}
									/>
								</td>
								<td>
									<MDBBtn
										className='action-btn'
										style={{ visibility: 'hidden' }}
									></MDBBtn>
									<MDBBtn
										className='action-btn'
										color='primary'
										onClick={onAddEmployee}
									>
										{inEditMode ? (
											<MDBIcon icon='pencil-alt' />
										) : (
											<MDBIcon icon='plus' />
										)}
									</MDBBtn>
								</td>
							</tr>
							{employees.map((employee) => (
								<tr key={employee.id}>
									<td>{employee.fullName}</td>
									<td className='text-center'>
										{employee.DOB}
									</td>
									<td className='text-center'>
										{employee.role}
									</td>
									<td>
										<MDBBtn
											className='action-btn'
											color='primary'
											onClick={() =>
												selectEditMode(employee)
											}
										>
											<MDBIcon icon='pencil-alt' />
										</MDBBtn>
										<MDBBtn
											className='action-btn'
											color='primary'
											onClick={() =>
												onDeleteEmployee(employee.id)
											}
										>
											<MDBIcon icon='trash-alt' />
										</MDBBtn>
									</td>
								</tr>
							))}
						</MDBTableBody>
					</MDBTable>
				</div>
			</Jumbotron>
		</MDBContainer>
	);
}

export default App;
