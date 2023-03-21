import {View, Text, Pressable, TextInput} from 'react-native';
import React, {useRef, useState} from 'react';
import MapView, {LatLng} from 'react-native-maps';
import styles from './style';
import Icon from '../../../components/Icon';
import {colors} from '../../../constants/colors';
import hospitalService from '../../../services/hospital-service';
import routeService from '../../../services/route-service';
import Map from '../../../components/Map';
import {decode} from '../../../utils';

interface IHospital {
  Ad: string;
  Adres: string;
  Email: string;
  Sehir: string;
  Tel: string;
  Website: string;
  ilce: string;
  latitude: number;
  longitude: number;
}

export default function Hospitals() {
  const [district, setDistrict] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [hospitals, setHospitals] = useState<IHospital[]>([]);
  const [hospital, setHospital] = useState<IHospital>();
  const [location, setLocation] = useState<LatLng | null>(null);
  const [routes, setRoutes] = useState<any>([]);
  const mapRef = useRef<MapView>(null);
  const [followLocation, setFollowLocation] = useState<boolean>(true);
  const [summary, setSummary] = useState<{
    distance: number;
    duration: number;
  }>();

  const onSuccess = (res: any) => {
    setHospitals(() => {
      return JSON.parse(res).data?.map((x: any) => {
        return {
          ...x,
          title: x?.Ad ?? '',
          description: x?.Adres ?? '',
        };
      });
    });
  };

  const onPressedSearch = () => {
    hospitalService.getHospitals(city, district, onSuccess);
  };

  const onSuccessRoute = (res: any) => {
    setSummary(res?.routes?.[0]?.summary ?? undefined);
    setRoutes(decode(res?.routes?.[0]?.geometry));
  };

  const findRoute = () => {
    if (location && hospital)
      routeService.getRoutes(location, hospital, onSuccessRoute);
  };

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          placeholder="İl giriniz.."
          value={city}
          onChangeText={setCity}
          style={styles.input}
        />
        <TextInput
          placeholder="İlçe giriniz.."
          value={district}
          onChangeText={setDistrict}
          style={styles.input}
        />
        <Pressable style={styles.searchButton} onPress={onPressedSearch}>
          <Text>Ara</Text>
        </Pressable>
        <Text>
          Seçili Hastane: {hospital?.Ad + '\n\n'}
          {summary?.distance && (summary?.distance / 1000).toFixed(2)} km
          {'  '}{summary?.duration && (summary?.duration / 60).toFixed(0)} dk
        </Text>
        <Pressable
          style={[styles.searchButton, {backgroundColor: colors.red}]}
          onPress={findRoute}>
          <Text style={{color: colors.white, fontWeight: '700'}}>
            Yol Tarifi al
          </Text>
        </Pressable>
      </View>

      <Map
        data={hospitals}
        followLocation={followLocation}
        setFollowLocation={setFollowLocation}
        ref={mapRef}
        routes={routes}
        setLocation={setLocation}
        setX={setHospital}
      />
      <Pressable
        style={styles.stopPlayButton}
        onPress={() => setFollowLocation(!followLocation)}>
        <Icon
          name={followLocation ? 'pause : matcom' : 'play : matcom'}
          size={40}
          color={colors.aqua}
        />
      </Pressable>
    </View>
  );
}
