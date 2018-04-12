import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';

const copyright =  <div> Copyright <Icon type="copyright" /> {(new Date()).getFullYear()} {window.AppConfigs.Copyright} </div> ;
const appcfg=window.AppConfigs;

class UserLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
  }
  getChildContext() {
    const { location } = this.props;
    return { location };
  }
  getPageTitle() {
    const { getRouteData, location } = this.props;
    const { pathname } = location;
    let title = appcfg.System_name;
    getRouteData('UserLayout').forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name} - `+title;
      }
    });
    return title;
  }
  render() {
    const { getRouteData } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="" className={styles.logo} src={appcfg.WebRoot+"logo.svg"} />
                <span className={styles.title}>{appcfg.Company_short_name}-{appcfg.System_name}</span>
              </Link>
            </div>
            <div className={styles.desc}><p/></div>
          </div>
          {
            getRouteData('UserLayout').map(item =>
              (
                <Route
                  exact={item.exact}
                  key={item.path}
                  path={item.path}
                  component={item.component}
                />
              )
            )
          }
          <GlobalFooter className={styles.footer} links={[]} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
