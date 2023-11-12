import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "./Components/Header";
import AllScreen from "./Screens/AllScreen";
import YourScreen from "./Screens/YourScreen";

const Stack = createStackNavigator();

const linking = {
  prefixes: [
    /* your linking prefixes */
  ],
  config: {
    screens: {
      /* configuration for matching screens with paths */
      all: "all",
      your: "your",
      NotFound: "404",
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="all"
        screenOptions={({ navigation, route }) => ({
          header: (props) => <Header {...props} />,
        })}
      >
        <Stack.Screen name="all" component={AllScreen} />
        <Stack.Screen name="your" component={YourScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
