import React, {useState, useEffect, useContext} from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, Alert, ActivityIndicator} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { FAB } from 'react-native-paper';
import { useAuth } from "../../hooks";
import {PetContext} from '../../contexts';
import styles from './styles';

export default function Medicine(props){
  const [id,setId] = useState('');
  const [register,setRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const {pet, setPet} = useContext(PetContext);
  const { medicineCreate, medicineList, medicineRemove } = useAuth();
  const [list, setList] = useState([ ]);


useEffect(()=>{
    async function list(){
      if( pet.idpet ){
        setLoading(true);
        const response = await medicineList(pet.idpet);
        if( response.medicines )
          setList(response.medicines);
        setLoading(false);
      }
    }
    list();
  },[pet]);

  
  const add = async (name) => {
    name = name.trim();
    if(name){
      setLoading(true);
      const response = await medicineCreate(pet.idpet,name);
      if( response.idmedicine ){
        const aux = [...list, response];
        setList(aux);
        setRegister(false);
      }
      else
        Alert.alert(response.error || "Problemas para cadastrar o medicamento");
      setLoading(false);
    }
    else
      Alert.alert("Forneça o nome do medicamento");
  };

  const remove = async (idmedicine,name) => {
    Alert.alert(
      null,
      `Excluir definitivamente o medicamento ${name}?`,
      [
        {
          text: "Sim",
          onPress: async () => {
            setLoading(true);
            const response = await medicineRemove(idmedicine);
            if( response.idmedicine ){
              const aux = [...list];
              for(let i = 0; i < aux.length; i++){
                if( aux[i].idmedicine == idmedicine ){
                  aux.splice(i,1);
                  setList(aux);
                  break;
                }
              }
            }
            else
              Alert.alert(response.error || "Problemas para excluir o medicamento");
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
          <Text style={styles.itemname}>{item.name} - {date}</Text>
        </View>
        <TouchableOpacity style={styles.remove} onPress={()=>remove(item.idmedicine,item.name)}>
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
            keyExtractor={item => item.idmedicine}
          />
        </ScrollView>
        :
        <Empty message="Clique no botão para cadastrar um medicamento" />
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
  const [name, setName] = useState('');

  return (
    <View style={styles.registercontainer}>
      <View style={styles.box}>
        <Text style={styles.title}>CADASTRAR MEDICAMENTO</Text>
        <View style={{marginTop:20}}>
          <Text style={styles.label}>Nome do medicamento</Text>
          <TextInput
            style={styles.input}
            onChangeText={setName}
            value={name}
            autoCapitalize="words"
          />
        </View>
        <View style={styles.boxButton}>
          <TouchableOpacity style={styles.button} onPress={()=>props.add(name)}>
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


