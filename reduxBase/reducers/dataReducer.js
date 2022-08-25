/** @format */

import {
	DELETE_INC,
	DELETE_PURCH,
	GET_INCOMES,
	GET_PRODUCTS,
	GET_PURCH,
	GET_STATISTICS1,
	UPDATE_INC,
	UPDATE_PROD,
	GET_STATISTICS2,
	GET_STATISTICS2b,
	DELETE_PROD,
	GET_STATISTICS3,
	GET_STATISTICS1b,
	GET_STATISTICS3b
} from '../types';
import moment from 'moment';

const initialState = {
	produkty: [],
	incomes: [],
	all: [],
	statistic1: [],
	statistic2: [],
	statistic2b: [],
	statistic3: []
};

const Statistic1Func = (arr) => {
	const data1 = [];
	for (let i = 0; i < arr.length; i++) {
		const indx = data1.findIndex((item) => {
			return item.x === arr[i].category;
		});

		if (indx >= 0) {
			data1[indx] = {
				x: data1[indx].x,
				y: data1[indx].y + arr[i].allCosts
			};
		} else {
			data1.push({ x: arr[i].category, y: arr[i].allCosts });
		}
	}
	return data1;
};

const Statistic2Func = (k, interwal, end, start) => {
	let arr1 = [];
	const time4 = (end - start) / interwal;

	for (let i = 0; i < k.length; i++) {
		const date1 = k[i].date.seconds * 1000;
		const cost1 = k[i].allCosts;
		const indxx = arr1.findIndex((item) => {
			return (
				date1.valueOf() >= item.min.valueOf() &&
				date1.valueOf() < item.max.valueOf()
			);
		});

		for (let j = 0; j < Math.ceil(time4); j++) {
			const func1 = () => {
				arr1[indxx] = {
					min: arr1[indxx].min,
					max: arr1[indxx].max,
					day: arr1[indxx].day,
					sum: arr1[indxx].sum + cost1
				};
			};
			const func2 = (first3, second3) => {
				arr1.push({
					min: first3,
					max: second3,
					day: moment(first3).format('Do M YY'),
					sum: cost1
				});
			};
			if (j === 0) {
				const first1 = start.valueOf();
				const second1 = start.valueOf() + interwal;
				if (date1 >= first1 && date1 < second1) {
					if (indxx >= 0) {
						func1();
					} else {
						func2(first1, second1);
					}
				}
			} else if (j > 0) {
				const first2 = start.valueOf() + interwal * j;
				const second2 = start.valueOf() + interwal * (j + 1);
				if (date1 >= first2 && date1 < second2) {
					if (indxx >= 0) {
						func1();
					} else {
						func2(first2, second2);
					}
				}
			}
		}
	}

	arr1.sort(function (a, b) {
		return a.min.valueOf() - b.min.valueOf();
	});
	return arr1;
};

const Statistic3Func = (l, m, roz1, roz2, type) => {
	const data1 = [];
	const data2 = [];

	const Loop = (one, two) => {
		for (let i = 0; i < one.length; i++) {
			const indu = two.findIndex((item) => {
				return item.x === one[i].category;
			});

			if (indu >= 0) {
				two[indu] = {
					x: two[indu].x,
					y: two[indu].y + one[i].allCosts
				};
			} else {
				two.push({ x: one[i].category, y: one[i].allCosts });
			}
		}
	};

	Loop(l, data1);
	Loop(m, data2);

	const data3 = [];
	for (let i = 0; i < data2.length; i++) {
		for (let j = 0; j < data2.length; j++) {
			if (krokro[j].x === data2[i].x) {
				let newCos;
				if (type === 'Purchase') {
					newCos = (data1[j].y / roz1 / (data2[i].y / roz2)) * 100 - 100;
				} else {
					newCos = (data2[i].y / roz2 / (data1[j].y / roz1)) * 100 - 100;
				}

				data3.push({ x: data1[j].x, y: newCos });
			}
		}
	}
	return data3;
};

export default function (state = initialState, action) {
	switch (action.type) {
		case GET_PRODUCTS:
			const order1 = action.payload.sort(function (a, b) {
				return b.date.seconds - a.date.seconds;
			});
			return { ...state, produkty: order1 };
		case DELETE_PROD:
			const newi = state.produkty.filter((item) => action.payload != item.id);
			return { produkty: newi };
		case GET_INCOMES:
			const order2 = action.payload.sort(function (a, b) {
				return b.date.seconds - a.date.seconds;
			});
			return { ...state, incomes: order2 };
		case DELETE_INC:
			const newi2 = state.incomes.filter((item) => action.payload != item.id);
			return { ...state, incomes: newi2 };
		case GET_PURCH:
			const newi3 = state.produkty.concat(state.incomes).sort(function (a, b) {
				return b.date.seconds - a.date.seconds;
			});
			return { ...state, all: newi3 };
		case DELETE_PURCH:
			const newi4 = state.all.filter((item) => action.payload != item.id);
			return { ...state, all: newi4 };
		case UPDATE_PROD:
			const newi5 = [...state.produkty];
			const indx = newi5.findIndex((item) => item.id === action.payload.id);
			newi5[indx] = action.payload.item;
			return { ...state, produkty: newi5 };
		case UPDATE_INC:
			const newi6 = [...state.incomes];
			const indx2 = newi6.findIndex((item) => item.id === action.payload.id);
			newi6[indx2] = action.payload.item;
			return { ...state, incomes: newi6 };
		case GET_STATISTICS1:
			const a = state.produkty.filter((item) => {
				return (
					action.payload.start.valueOf() < item.date.seconds * 1000 &&
					action.payload.end.valueOf() > item.date.seconds * 1000
				);
			});

			return { ...state, statistic1: [...Statistic1Func(a)] };
		case GET_STATISTICS1b:
			const b = state.incomes.filter((item) => {
				return (
					action.payload.start.valueOf() < item.date.seconds * 1000 &&
					action.payload.end.valueOf() > item.date.seconds * 1000
				);
			});

			return { ...state, statistic1: [...Statistic1Func(b)] };
		case GET_STATISTICS2:
			const { start, end, interwal, category } = action.payload;
			const c = state.produkty.filter((item) => {
				if (category === 'All Categories') {
					return (
						start.valueOf() < item.date.seconds * 1000 &&
						end.valueOf() > item.date.seconds * 1000
					);
				} else {
					return (
						category === item.category &&
						start.valueOf() < item.date.seconds * 1000 &&
						end.valueOf() > item.date.seconds * 1000
					);
				}
			});

			return {
				...state,
				statistic2: [...Statistic2Func(c, interwal, end, start)]
			};
		case GET_STATISTICS2b:
			const {
				start: start2,
				end: end2,
				interwal: interwal2,
				category: category2
			} = action.payload;
			const d = state.incomes.filter((item) => {
				if (category2 === 'All Categories') {
					return (
						start2.valueOf() < item.date.seconds * 1000 &&
						end2.valueOf() > item.date.seconds * 1000
					);
				} else {
					return (
						category2 === item.category &&
						start2.valueOf() < item.date.seconds * 1000 &&
						end2.valueOf() > item.date.seconds * 1000
					);
				}
			});

			return {
				...state,
				statistic2b: [...Statistic2Func(d, interwal2, end2, start2)]
			};
		case GET_STATISTICS3:
			const { startRange1, endRange1, startRange2, endRange2, type } =
				action.payload;
			const roz1 = (startRange1.valueOf() - endRange1.valueOf()) / 86400000;
			const roz2 = (startRange2.valueOf() - endRange2.valueOf()) / 86400000;

			const e = state.produkty.filter((item) => {
				return (
					startRange1.valueOf() < item.date.seconds * 1000 &&
					endRange1.valueOf() > item.date.seconds * 1000
				);
			});

			const f = state.produkty.filter((item) => {
				return (
					startRange2.valueOf() < item.date.seconds * 1000 &&
					endRange2.valueOf() > item.date.seconds * 1000
				);
			});

			return {
				...state,
				statistic3: [...Statistic3Func(e, f, roz1, roz2, type)]
			};
		case GET_STATISTICS3b:
			const {
				startRange1: startRange1b,
				endRange1: endRange1b,
				startRange2: startRange2b,
				endRange2: endRange2b,
				type: typeb
			} = action.payload;
			const roz1b = (endRange1b.valueOf() - startRange1b.valueOf()) / 86400000;
			const roz2b = (endRange2b.valueOf() - startRange2b.valueOf()) / 86400000;

			const g = state.incomes.filter((item) => {
				console.log(
					startRange1b.valueOf(),
					endRange1b.valueOf(),
					item.date.seconds * 1000
				);
				return (
					startRange1b.valueOf() < item.date.seconds * 1000 &&
					endRange1b.valueOf() > item.date.seconds * 1000
				);
			});

			const h = state.incomes.filter((item) => {
				return (
					startRange2b.valueOf() < item.date.seconds * 1000 &&
					endRange2b.valueOf() > item.date.seconds * 1000
				);
			});

			return {
				...state,
				statistic3: [...Statistic3Func(g, h, roz1b, roz2b, typeb)]
			};
		default:
			return { ...state };
	}
}
