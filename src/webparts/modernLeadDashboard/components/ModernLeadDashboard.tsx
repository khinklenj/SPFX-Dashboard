import * as React from 'react';
import styles from './ModernLeadDashboard.module.scss';
import type { IModernLeadDashboardProps } from './IModernLeadDashboardProps';
import { escape } from '@microsoft/sp-lodash-subset';

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

import { Line, Doughnut } from 'react-chartjs-2';
import type { ChartOptions, ChartData } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend);

type Metric = {
  metric_name: string;
  value: number;
  color: string;
};

export default class ModernLeadDashboard extends React.Component<IModernLeadDashboardProps, { metrics: Metric[] }> {
  constructor(props: IModernLeadDashboardProps) {
    super(props);
    this.state = {
      metrics: []
    };
  }

  public componentDidMount(): void {
    fetch('https://o8zial98ig.execute-api.us-east-1.amazonaws.com/dev/stats')
      .then(async (res) => {
        const response = await res.json();
  
        let metrics: Metric[] = [];
  
        try {
          // If body is a stringified array, parse it
          if (typeof response.body === 'string') {
            metrics = JSON.parse(response.body);
          }
          // If body is already parsed array
          else if (Array.isArray(response.body)) {
            metrics = response.body;
          }
          // If response itself is already an array (direct Lambda proxy)
          else if (Array.isArray(response)) {
            metrics = response;
          } else {
            throw new Error('Unexpected response structure');
          }
        } catch (err) {
          console.error('Parsing failed:', err);
        }
  
        this.setState({ metrics });
      })
      .catch((err) => {
        console.error('Failed to load metrics:', err);
      });
  }
  

  public render(): React.ReactElement<IModernLeadDashboardProps> {
    const { hasTeamsContext, userDisplayName } = this.props;
    const { metrics } = this.state;

    const chartData: ChartData<'line'> = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Team Calls',
          data: [60, 70, 80, 60, 90, 80, 75],
          borderColor: '#6264A7',
          backgroundColor: 'transparent',
          tension: 0.4
        },
        {
          label: 'Emails',
          data: [30, 50, 60, 40, 65, 70, 68],
          borderColor: '#F7630C',
          backgroundColor: 'transparent',
          tension: 0.4
        },
        {
          label: 'Texts',
          data: [20, 40, 45, 70, 55, 60, 62],
          borderColor: '#FFB900',
          backgroundColor: 'transparent',
          tension: 0.4
        }
      ]
    };

    const chartOptions: ChartOptions<'line'> = {
      responsive: true,
      plugins: {
        legend: { position: 'top' as const },
        tooltip: { mode: 'index' as const, intersect: false }
      },
      scales: {
        y: { beginAtZero: true },
        x: {}
      }
    };

    const donutOptions: ChartOptions<'doughnut'> = {
      responsive: true,
      rotation: -90,
      circumference: 180,
      cutout: '70%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    };

    const createGaugeData = (value: number, color: string): ChartData<'doughnut'> => ({
      labels: ['Used', 'Remaining'],
      datasets: [
        {
          data: [value, 100 - value],
          backgroundColor: [color, '#ddd'],
          borderWidth: 0
        }
      ]
    });

    return (
      <section className={`${styles.modernLeadDashboard} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <h2>Welcome, {escape(userDisplayName)}!</h2>
        </div>

        {/* Chart Card */}
        <div className={styles.chartCard}>
          <h3>Activity Overview</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Donut Gauges */}
        <div className={styles.gaugeSection}>
          <h3>Progress</h3>
          <div className={styles.gauges}>
            {metrics.map((m, i) => (
              <div className={styles.gaugeItem} key={i}>
                <Doughnut data={createGaugeData(m.value, m.color)} options={donutOptions} />
                <div className={styles.gaugeLabel}>{m.metric_name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Raw API Response for Debugging */}
        <div className={styles.rawApiResponse}>
          <h3>API Response</h3>
          <pre style={{ backgroundColor: '#f4f4f4', padding: '1em', borderRadius: '5px', overflowX: 'auto' }}>
            {JSON.stringify(metrics, null, 2)}
          </pre>
        </div>

        {/* Static My Day */}
        <div className={styles.myDayCard}>
          <h3>My day</h3>
          <div className={styles.eventItem}>
            <div className={styles.eventTitle}>Canceled: Yammer Monthly MVP Call (EMEA Friendly)</div>
            <div className={styles.eventTime}>4:00 PM - 5:00 PM</div>
            <div className={styles.eventLocation}>Microsoft Teams</div>
          </div>
          <div className={styles.eventItem}>
            <div className={styles.eventTitle}>Monthly Yammer MVP Call (APAC friendly)</div>
            <div className={styles.eventTime}>9:10 PM - 10:00 PM</div>
            <div className={styles.eventLocation}>Microsoft Teams</div>
          </div>
          <div className={styles.eventItem}>
            <div className={styles.eventTitle}>PnP team – Bi-weekly sync across the team</div>
            <div className={styles.eventTime}>4:00 PM - 4:50 PM</div>
            <div className={styles.eventLocation}>Microsoft Teams</div>
          </div>
        </div>
      </section>
    );
  }
}
