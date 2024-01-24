import { createDrawerNavigator } from '@react-navigation/drawer';
import Scan from '../../../screen/Scan'
import CreateQR from '../../../screen/CreateQR'
import QRList from '../../../screen/QRList';
import Settings from '../../../screen/Settings';
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux'



const Drawers = createDrawerNavigator();

export default function Drawer() {
  const {t} = useTranslation()
  const {mode} = useSelector((state) => state.mode)

    return (

        <Drawers.Navigator screenOptions={{headerTintColor: mode ? 'silver' : 'black'}}>
          <Drawers.Screen options={{title: t("Scan")}} name="Scan" component={Scan} />
          <Drawers.Screen options={{title: t("Create QR")}} name="Create QR" component={CreateQR} />
          <Drawers.Screen options={{title: t("Settings")}} name="Settings" component={Settings} />
          <Drawers.Screen options={{title: t("QR List")}} name="QRList" component={QRList} />
        </Drawers.Navigator>

      );
}