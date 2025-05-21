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

export default class ModernLeadDashboard extends React.Component<IModernLeadDashboardProps> {
  public render(): React.ReactElement<IModernLeadDashboardProps> {
    const {
      hasTeamsContext,
      userDisplayName
    } = this.props;

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
        legend: {
          position: 'top' as const
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        },
        x: {}
      }
    };

    const donutOptions: ChartOptions<'doughnut'> = {
      responsive: true,
      rotation: -90,
      circumference: 180,
      cutout: '70%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
        }
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
            <div className={styles.gaugeItem}>
              <Doughnut data={createGaugeData(75, '#0078d4')} options={donutOptions} />
              <div className={styles.gaugeLabel}>Clients</div>
            </div>
            <div className={styles.gaugeItem}>
              <Doughnut data={createGaugeData(55, '#f7630c')} options={donutOptions} />
              <div className={styles.gaugeLabel}>Hours Spent</div>
            </div>
            <div className={styles.gaugeItem}>
              <Doughnut data={createGaugeData(40, '#107c10')} options={donutOptions} />
              <div className={styles.gaugeLabel}>Total Hours</div>
            </div>
          </div>
        </div>

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
