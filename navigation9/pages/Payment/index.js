import React, {useState, useEffect, useContext} from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, Alert, ActivityIndicator} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { FAB } from 'react-native-paper';
import { useAuth } from "../../hooks";
import {PetContext} from '../../contexts';
import styles from './styles';

export default function Payment(props){
  const [register,setRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const {pet, setPet} = useContext(PetContext);
  // o hook useAuth substitui o uso do AuthContext
  const { paymentCreate, paymentList, paymentRemove } = useAuth();
  const [list, setList] = useState([]);

  useEffect(()=>{
    async function list(){
      if( pet.idpet ){
        setLoading(true);
        const response = await paymentList(pet.idpet);
        if( response.payments )
          setList(response.payments);
        setLoading(false);
      }
    }
    list();
  },[pet]);

  const add = async (description,value) => {
    description = description.trim();
    value = value.trim();
    if( description && value ){
      setLoading(true);
      const response = await paymentCreate(pet.idpet,description,value);
      if( response.idpayment ){
        const aux = [...list, response];
        setList(aux);
        setRegister(false);
      }
      else
        Alert.alert(response.error || "Problemas para cadastrar o pagamento");
      setLoading(false);
    }
    else
      Alert.alert("Forneça a descrição e valor do gasto");
  };

const remove = async (idpayment,description) => {
    Alert.alert(
      null,
      `Excluir definitivamente o pagamento ${description}?`,
      [
        {
          text: "Sim",
          onPress: async () => {
            setLoading(true);
            const response = await paymentRemove(idpayment);
            if( response.idpayment ){
              const aux = [...list];
              for(let i = 0; i < aux.length; i++){
                if( aux[i].idpayment == idpayment ){
                  aux.splice(i,1);
                  setList(aux);
                  break;
                }
              }
            }
            else
              Alert.alert(response.error || "Problemas para excluir o pagamento");
            setLoading(false);
          },
        },
        {
          text: "Não",
        }
      ]);
  };

  const renderItem = ({ item }) => {
    let date = item.date.split("-");
    date = `${date[2]}/${date[1]}/${date[0]}`;
    return (
      <View style={styles.item}>
        <View style={styles.itemtext}>
          <Text style={styles.itemname}>{item.description}</Text>
          <Text style={styles.itemname}>R${item.value} - {date}</Text>
        </View>
        <TouchableOpacity style={styles.remove} onPress={()=>remove(item.idpayment,item.description)}>
          <MaterialCommunityIcons name='delete' color="#555" size={25} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    loading ? 
      <Loading />
    :
    register ?
      <Register lista={list} setLista={setList} setRegister={setRegister} add={add} />
    : 
    pet?.name ?
    (
    <View style={styles.container}>
      <View style={styles.titlebox}>
        <Text style={styles.titletext}>{pet?.name}</Text>
      </View>
      {
        list.length > 0 ?
        <ScrollView style={[styles.scroll,{flexGrow:1}]}>
          <FlatList
            data={list}
            renderItem={renderItem}
            keyExtractor={item => item.idpayment}
          />
        </ScrollView>
        :
        <Empty message="Clique no botão para cadastrar um pagamento" />
      }
      <FAB
        style={styles.add}
        small
        color="white"
        icon="plus"
        onPress={() => setRegister(true)}
      />
    </View>
    )
    :
    <View style={styles.container}>
      <Empty message="Cadastre um pet na aba Pet" />
    </View>
  );
}

function Empty(props){
  return (
    <View style={styles.msg}>
      <Text style={styles.msgtext}>
        {props.message}
      </Text>
    </View>
  );
}

function Register(props){
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');

  return (
    <View style={styles.registercontainer}>
      <View style={styles.box}>
        <Text style={styles.title}>CADASTRAR GASTO</Text>
        <View style={{marginTop:20}}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={styles.input}
            onChangeText={setDescription}
            value={description}
            autoCapitalize="words"
          />
        </View>
        <View style={{marginTop:20}}>
          <Text style={styles.label}>Valor</Text>
          <TextInput
            style={styles.input}
            onChangeText={setValue}
            value={value}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={styles.boxButton}>
          <TouchableOpacity style={styles.button} onPress={()=>props.add(description,value)}>
            <Text style={styles.buttonLabel}>salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={()=>props.setRegister(false)}>
            <Text style={styles.buttonLabel}>voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const Loading = () => (
  <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: '#FFC125'}}>
    <ActivityIndicator size="large" color="#666" />
  </View>
);


