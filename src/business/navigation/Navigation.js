import {createBottomTabNavigator} from 'react-navigation'

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator(props) {

  return (
    <BottomTab.Navigator screenOptions={{ headerShown: false }}
      
      tabBarOptions={{ 
        
        activeTintColor: "#2bc475",
        labelStyle: {
          marginTop: -2
        }
      }
    }>
    
      <BottomTab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Calendar"
        component={CalendarNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-calendar" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Account"
        component={AccountNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-people" color={color}/>,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator();

function HomeNavigator() {
  return (
    <TabOneStack.Navigator screenOptions={{ headerShown: false }}>
      <TabOneStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: 'Home' }}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator();

function CalendarNavigator() {
  return (
    <TabTwoStack.Navigator screenOptions={{ headerShown: false}} >
      <TabTwoStack.Screen
      
        name="Calendar"
        component={CalendarScreen}
        options={{ headerTitle: 'Calendar' }}
      />
    </TabTwoStack.Navigator>
  );
}

const TabThreeStack = createStackNavigator();
function AccountNavigator() {
  return (
    <TabThreeStack.Navigator screenOptions={{ headerShown: false }}>
      <TabThreeStack.Screen
        name="Account"
        component={AccountScreen}
        options={{ headerTitle: 'Account' }}

      />
    </TabThreeStack.Navigator>
  );
}
