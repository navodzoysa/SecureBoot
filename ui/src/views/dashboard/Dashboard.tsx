import ReactECharts from 'echarts-for-react';
import { Grid } from '@mantine/core';

export default function Dashboard() {
	const lineChart = {
		grid: { top: 8, right: 8, bottom: 24, left: 36 },
		xAxis: {
		type: 'category',
		data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		},
		yAxis: {
		type: 'value',
		},
		series: [
		{
			data: [820, 932, 901, 934, 1290, 1330, 1320],
			type: 'line',
			smooth: true,
		},
		],
		tooltip: {
		trigger: 'axis',
		},
	};
	
	const pieChart = {
		tooltip: {
			trigger: 'item'
		},
		legend: {
			top: '5%',
			left: 'center'
		},
		series: [
			{
			name: 'Access From',
			type: 'pie',
			radius: ['40%', '70%'],
			avoidLabelOverlap: false,
			itemStyle: {
				borderRadius: 10,
				borderColor: '#fff',
				borderWidth: 2
			},
			label: {
				show: false,
				position: 'center'
			},
			emphasis: {
				label: {
				show: true,
				fontSize: 40,
				fontWeight: 'bold'
				}
			},
			labelLine: {
				show: false
			},
			data: [
				{ value: 1048, name: 'Welcome' },
				{ value: 735, name: 'Dashboard' },
				{ value: 580, name: 'Devices' },
				{ value: 484, name: 'Firmware' },
				{ value: 300, name: 'Provisioning' }
			]
			}
		]
	};

	const barChart = {
		dataset: {
			source: [
			['score', 'amount', 'product'],
			[89.3, 58212, 'Matcha Latte'],
			[57.1, 78254, 'Milk Tea'],
			[74.4, 41032, 'Cheese Cocoa'],
			[50.1, 12755, 'Cheese Brownie'],
			[89.7, 20145, 'Matcha Cocoa'],
			[68.1, 79146, 'Tea'],
			[19.6, 91852, 'Orange Juice'],
			[10.6, 101852, 'Lemon Juice'],
			[32.7, 20112, 'Walnut Brownie']
			]
		},
		grid: { containLabel: true },
		xAxis: { name: 'amount' },
		yAxis: { type: 'category' },
		visualMap: {
			orient: 'horizontal',
			left: 'center',
			min: 10,
			max: 100,
			text: ['High Score', 'Low Score'],
			// Map the score column to color
			dimension: 0,
			inRange: {
			color: ['#65B581', '#FFCE34', '#FD665F']
			}
		},
		series: [
			{
			type: 'bar',
			encode: {
				// Map the "amount" column to X axis.
				x: 'amount',
				// Map the "product" column to Y axis
				y: 'product'
			}
			}
		]
	};

	const gaugeData = [
		{
			value: 20,
			name: 'Good',
			title: {
			offsetCenter: ['-40%', '80%']
			},
			detail: {
			offsetCenter: ['-40%', '95%']
			}
		},
		{
			value: 40,
			name: 'Better',
			title: {
			offsetCenter: ['0%', '80%']
			},
			detail: {
			offsetCenter: ['0%', '95%']
			}
		},
		{
			value: 60,
			name: 'Perfect',
			title: {
			offsetCenter: ['40%', '80%']
			},
			detail: {
			offsetCenter: ['40%', '95%']
			}
		}
	];

	const gauge = {
		series: [
			{
			type: 'gauge',
			anchor: {
				show: true,
				showAbove: true,
				size: 18,
				itemStyle: {
				color: '#FAC858'
				}
			},
			pointer: {
				icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
				width: 8,
				length: '80%',
				offsetCenter: [0, '8%']
			},
			progress: {
				show: true,
				overlap: true,
				roundCap: true
			},
			axisLine: {
				roundCap: true
			},
			data: gaugeData,
			title: {
				fontSize: 14
			},
			detail: {
				width: 40,
				height: 14,
				fontSize: 14,
				color: '#fff',
				backgroundColor: 'inherit',
				borderRadius: 3,
				formatter: '{value}%'
			}
			}
		]
	};

	return (
		<Grid>
			<Grid.Col span={6}>
				<ReactECharts option={lineChart} />
			</Grid.Col>
			<Grid.Col span={6}>
				<ReactECharts option={pieChart} />
			</Grid.Col>
			<Grid.Col span={6}>
				<ReactECharts option={barChart} />
			</Grid.Col>
			<Grid.Col span={6}>
				<ReactECharts option={gauge} />
			</Grid.Col>
		</Grid>
	);
};