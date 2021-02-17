import React, {useEffect, useState} from 'react';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import {Dimensions, StyleSheet, ActivityIndicator} from 'react-native';
import SingleVideo from './components/SingleVideo';

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(0); // intial page number.
  const [data, SetData] = useState([]);
  const [_dataProvider, setDataProvider] = useState(
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows([]),
  );

  useEffect(() => {
    const getNextPage = async () => {
      try {
        let response = await fetch(
          'https://europe-west1-boom-dev-7ad08.cloudfunctions.net/videoFeed',
          {
            method: 'POST',
            body: JSON.stringify({page: pageNo}),
            headers: {
              'Content-type': 'application/json',
            },
          },
        );
        let json = await response.json();
        setDataProvider((prevState) =>
          prevState.cloneWithRows(data.concat(json)),
        );
        SetData((prevState) => prevState.concat(json));
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getNextPage();
  }, [pageNo]);

  const screen = Dimensions.get('window');

  const [_layoutProvider] = useState(
    new LayoutProvider(
      (index) => 1,
      (type, dim) => {
        (dim.height = screen.height), (dim.width = screen.width);
      },
    ),
  );

  const _rowRenderer = (type, data) => (
    <SingleVideo playbackUrl={data.playbackUrl} />
  );

  const _renderFooter = () => (
    <ActivityIndicator size={'large'} color={'white'} style={styles.loader} />
  );

  const _onEndReached = () => {
    if (isLoading) return; // to stop multiple requests.
    setLoading(true);
    // appending new playbackurls to the current data set.
    setPageNo(pageNo + 1); // runs effect.
  };

  return (
    <>
      {data.length === 0 ? ( // Componentwillmount phase.
        <ActivityIndicator
          size={'large'}
          color={'white'}
          style={styles.loader}
        />
      ) : (
        <RecyclerListView
          layoutProvider={_layoutProvider}
          dataProvider={_dataProvider}
          onEndReached={_onEndReached}
          renderAheadOffset={0}
          showsVerticalScrollIndicator={false}
          snapToInterval={screen.height}
          snapToAlignment={'start'}
          decelerationRate={'fast'}
          renderFooter={_renderFooter}
          rowRenderer={_rowRenderer}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    height: Dimensions.get('window').height,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default App;
