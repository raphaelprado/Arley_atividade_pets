import React, { FC, useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FAB } from 'react-native-paper';
import { useAuth } from '../../hooks';
import { PetContext } from '../../contexts';
import styles from './styles';

interface PaymentProps {
  idpayment: string;
  description: string;
  value: number;
  date: string;
}

export default function Payment(props: any) {
  const [register, setRegister] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { pet } = useContext(PetContext);
  // o hook useAuth substitui o uso do AuthContext
  const { paymentCreate, paymentList, paymentRemove } = useAuth();
  const [list, setList] = useState<PaymentProps[]>([]);

  useEffect(() => {
    async function list() {
      if (pet.idpet) {
        setLoading(true);
        const response = await paymentList(pet.idpet);
        if (response.payments) setList(response.payments);
        setLoading(false);
      }
    }
    list();
  }, [pet, paymentList]);

  const add = async (description: string, value: number) => {
    if (description && value) {
      setLoading(true);
      const response = await paymentCreate(pet.idpet, description, value);
      if (response.idpayment) {
        const aux: PaymentProps[] = [...list, response];
        setList(aux);
        setRegister(false);
      } else
        Alert.alert(response.error || 'Problemas para cadastrar o pagamento');
      setLoading(false);
    } else Alert.alert('Forneça a descrição e valor do gasto');
  };

  const remove = async (idpayment: string, description: string) => {
    Alert.alert('', `Excluir definitivamente o pagamento ${description}?`, [
      {
        text: 'Sim',
        onPress: async () => {
          setLoading(true);
          const response = await paymentRemove(idpayment);
          if (response.idpayment) {
            const aux = [...list];
            for (let i = 0; i < aux.length; i++) {
              if (aux[i].idpayment == idpayment) {
                aux.splice(i, 1);
                setList(aux);
                break;
              }
            }
          } else
            Alert.alert(response.error || 'Problemas para excluir o pagamento');
          setLoading(false);
        },
      },
      {
        text: 'Não',
      },
    ]);
  };

  const Item: FC<PaymentProps> = (props) => {
    const date: string[] = props.date.split('-'); // aaaa-mm-dd
    const fdate: string = `${date[2]}/${date[1]}/${date[0]}`;
    return (
      <View style={styles.item}>
        <View style={styles.itemtext}>
          <Text style={styles.itemname}>{props.description}</Text>
          <Text style={styles.itemname}>
            R${props.value} - {fdate}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.remove}
          onPress={() => remove(props.idpayment, props.description)}>
          <MaterialCommunityIcons name="delete" color="#555" size={25} />
        </TouchableOpacity>
      </View>
    );
  };

  return loading ? (
    <Loading />
  ) : register ? (
    <Register
      lista={list}
      setLista={setList}
      setRegister={setRegister}
      add={add}
    />
  ) : pet.name ? (
    <View style={styles.container}>
      <View style={styles.titlebox}>
        <Text style={styles.titletext}>{pet.name}</Text>
      </View>
      {list.length > 0 ? (
        <ScrollView style={[styles.scroll, { flexGrow: 1 }]}>
          <FlatList
            data={list}
            renderItem={({ item }) => <Item {...item} />}
            keyExtractor={(item) => item.idpayment}
          />
        </ScrollView>
      ) : (
        <Empty message="Clique no botão para cadastrar um pagamento" />
      )}
      <FAB
        style={styles.add}
        small
        color="white"
        icon="plus"
        onPress={() => setRegister(true)}
      />
    </View>
  ) : (
    <View style={styles.container}>
      <Empty message="Cadastre um pet na aba Pet" />
    </View>
  );
}

const Empty: FC<{ message: string }> = (props) => (
  <View style={styles.msg}>
    <Text style={styles.msgtext}>{props.message}</Text>
  </View>
);

function Register(props: any) {
  const [description, setDescription] = useState<string>('');
  const [value, setValue] = useState<string>('');

  return (
    <View style={styles.registercontainer}>
      <View style={styles.box}>
        <Text style={styles.title}>CADASTRAR GASTO</Text>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={styles.input}
            onChangeText={setDescription}
            value={description}
            autoCapitalize="words"
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>Valor</Text>
          <TextInput
            style={styles.input}
            onChangeText={setValue}
            value={value}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={styles.boxButton}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => props.add(description.trim(), parseFloat(value))}>
            <Text style={styles.buttonLabel}>salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => props.setRegister(false)}>
            <Text style={styles.buttonLabel}>voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const Loading: FC = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFC125',
    }}>
    <ActivityIndicator size="large" color="#666" />
  </View>
);
