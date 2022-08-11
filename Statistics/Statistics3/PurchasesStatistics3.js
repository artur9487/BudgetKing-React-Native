/** @format */

import React from 'react';
import { useSelector } from 'react-redux';
import Statistics3 from './Statistics3';

const PurchasesStatistics3 = () => {
	const datak = useSelector((state) => state.data.statistic3);
	return (
		<Statistics3
			datak={datak}
			title='Percentage rate of purchases estimation during time perspective'
			type='Purchase'
		/>
	);
};

export default PurchasesStatistics3;
