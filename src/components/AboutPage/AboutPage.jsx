import React from 'react';
import Nav from '../Nav/Nav';
import { useHistory } from 'react-router-dom';

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'

function AboutPage() {
	const history = useHistory();

	return (
		<>
			<Nav />
			<div className='aboutPage'>
				<h3>Next Steps</h3>
				<ul>
					<li>Show players currently online</li>
				</ul>
				<h3>Technologies used</h3>
				<ul>
					<li>React</li>
					<li>Redux</li>
					<li>Redux-Saga</li>
					<li>Node</li>
					<li>Express</li>
					<li>Postgres</li>
					<li>Socket.io for the messaging</li>
					<li>Sweet Alerts 2</li>
					<li>Material UI</li>
				</ul>
				<h3>People I would like to thank</h3>
				<li>My Wife</li>
				<li>The Jemisin Cohort</li>
				<li onClick={() => history.push('/me')}>My Instructor Liz</li>
			</div>
		</>
	);
}

export default AboutPage;
