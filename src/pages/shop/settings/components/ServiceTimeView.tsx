import React, { Fragment, PureComponent } from 'react';

import { TimePicker } from 'antd';
import styles from './ServiceTime.less';
import moment from 'moment';

interface ServiceTimeViewProps {
  value?: string;
  onChange?: (value: string) => void;
}

const format = "HH:mm";

class ServiceTimeView extends PureComponent<ServiceTimeViewProps> {
  render() {
    const { value, onChange } = this.props;
    let values = ['00:00', '00:00'];
    if (value) {
      values = value.split('-');
    }
    return (
      <Fragment>
        <TimePicker
          format={format}
          value={moment(values[0], format)}
          onChange={(time, timeString) => {
            if (onChange) {
              onChange(`${timeString}-${values[1]}`);
            }
          }}
        />
        <span className={styles.time_split}>~</span>
        <TimePicker
          format={format}
          value={moment(values[1], format)}
          onChange={(time, timeString) => {
            if (onChange) {
              onChange(`${values[0]}-${timeString}`);
            }
          }}
          
        />
      </Fragment>
    );
  }
}

export default ServiceTimeView;
