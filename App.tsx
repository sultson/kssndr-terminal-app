import React from 'react';
import { StatusBar} from 'react-native';
import { RootStackNavigator } from './src/navigation/RootStackNavigator';


const App: React.FC = () => {
  React.useEffect(() => {
    StatusBar.setHidden(true)
  }, [])  
  return (
    <RootStackNavigator/>
  );
}

export default App;
