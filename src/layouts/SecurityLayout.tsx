import React from 'react';
import { ConnectProps, ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import PageLoading from '@/components/PageLoading';
import { Redirect } from 'umi';
import { connect } from 'dva';


interface SecurityLayoutProps extends ConnectProps {
  loading: boolean;
  currentUser: CurrentUser;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  }

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }


  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props;
    if ((!currentUser.id && loading) || !isReady) {
      return <PageLoading/>;
    }
    if (!currentUser.id) {
      return <Redirect to="/user/login"></Redirect>;
    }
    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);