import React, { useState, useEffect, Fragment } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';

import url from './api';

const App = () => {
	const [showInput, setShowInput] = useState(false);
	const [buttonValue, setButtonValue] = useState('');
	const [inputValue, setInputValue] = useState('');
	const [showValue, setShowValue] = useState('');
	const [dataArr, setDataArr] = useState([]);
	const [submit, setSubmit] = useState(false);

	useEffect(() => {
		setShowValue(`${url}${buttonValue}/${inputValue}`);
	}, [buttonValue, inputValue]);

	const buttonValues = {
		People: 'people',
		Planets: 'planets',
		Starships: 'starships',
	};

	const handleClick = value => {
		setShowInput(true);
		setInputValue('');
		setSubmit(false);
		setButtonValue(value);
		setShowValue(`${url}${value}`);
	};

	const handleInputChange = e => {
		setSubmit(false);
		setInputValue(e.target.value);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		console.log('Отправка запроса на URL:', showValue);
		await request(showValue);
	};

	const handleKeyPress = e => {
		if (e.key === 'Enter') {
			e.preventDefault();
		}
	};

	const renderProperties = item => {
		return Object.entries(item.properties).map(([key, value]) => {
			const label = key
				.replace(/_/g, ' ')
				.replace(/([A-Z])/g, ' $1')
				.toLowerCase()
				.split(' ')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');

			return value !== 'n/a' ? (
				<ListGroup.Item key={key}>{`${label}: ${value}`}</ListGroup.Item>
			) : null;
		});
	};

	const request = async requestUrl => {
		try {
			setDataArr([]);
			const res = await fetch(requestUrl);
			const data = await res.json();
			await setDataArr([data.result]);
			setSubmit(true);
			console.log('Полученные данные:', data.result);
		} catch (error) {
			console.error('Ошибка запроса:', error);
		}
	};

	return (
		<div>
			<Container>
				<ButtonGroup
					size='lg'
					className='mb-2 mt-2 d-flex justify-content-center'
				>
					{Object.keys(buttonValues).map(key => (
						<Button key={key} onClick={() => handleClick(buttonValues[key])}>
							{key}
						</Button>
					))}
				</ButtonGroup>
				{showInput && (
					<Form>
						<Form.Group className='mb-3'>
							<Form.Label>Add quantity</Form.Label>
							<InputGroup>
								<InputGroup.Text id='basic-addon3'>{showValue}</InputGroup.Text>
								<Form.Control
									id='basic-url'
									aria-describedby='basic-addon3'
									type='number'
									value={inputValue}
									onChange={handleInputChange}
									onKeyPress={handleKeyPress}
								/>
							</InputGroup>
						</Form.Group>
						<Button onClick={handleSubmit} disabled={!inputValue}>
							Submit
						</Button>
					</Form>
				)}
				{submit && dataArr.length > 0 && (
					<Fragment>
						<h1 className='mt-3'>{dataArr[0].description}</h1>
						<ListGroup className='mt-3'>
							{dataArr.map(item => (
								<Fragment key={item.uid}>{renderProperties(item)}</Fragment>
							))}
						</ListGroup>
					</Fragment>
				)}
			</Container>
		</div>
	);
};

export default App;
