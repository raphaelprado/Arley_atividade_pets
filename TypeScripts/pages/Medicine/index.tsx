import React, {FC, useState, useEffect, useContext} from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, Alert, ActivityIndicator} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FAB } from 'react-native-paper';
import { useAuth } from "../../hooks";
import { PetContext } from '../../contexts';
import styles from './styles';

interface MedicineProps {
  idmedicine: string;
  name: string;
  value: number;
  idpet: string;
  date: string;
}

type Props = {
  add: Function,
  setRegister: Function,
  setList: Function,
  list: Array<MedicineProps>
};

export default function Medicine(props:any){
  const [register, setRegister] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {pet} = useContext(PetContext);
  // o hook useAuth substitui o uso do AuthContext
  const { medicineCreate, medicineList, medicineRemove } = useAuth();
  const [list, setList] = useState<MedicineProps[]>([]);

  useEffect(()=>{
    async function list() {
      if (pet.idpet) {
        setLoading(true);
        const response = await medicineList(pet.idpet);
        if (response.medicine) setList(response.medicine);
        setLoading(false);
      }
    }
    list();
  }, [pet, medicineList]);

  const add = async (name:string,value:number) => {
    name = name.trim();
    if( name && value ){
      setLoading(true);
      const response = await medicineCreate(pet.idpet,name,value);
      if( response.idmedicine ){
        const aux:MedicineProps[] = [...list, response];
        setList(aux);
        setRegister(false);
      }
      else
        Alert.alert(response.error || "Problemas para cadastrar o medicamento");
      setLoading(false);
    }
    else
      Alert.alert("Forneça a descrição e valor do gasto");
  };

  const remove = async (idmedicine:string, name:string) => {
    Alert.alert(
      '',
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
              Alert.alert(response.error || "Problemas para excluir o pagamento");
            setLoading(false);
          },
        },
        {
          text: "Não",
        }
      ]);
  };

  const Item:FC<MedicineProps> = (props) => {
    const date:string[] = props.date.split("-");  // aaaa-mm-dd
    const fdate:string = `${date[2]}/${date[1]}/${date[0]}`;
    return (
      <View style={styles.item}>
        <View style={styles.itemtext}>
          <Text style={styles.itemname}>{props.name}</Text>
          <Text style={styles.itemname}>R${props.value} - {fdate}</Text>
        </View>
        <TouchableOpacity style={styles.remove} onPress={()=>remove(props.idmedicine,props.name)}>
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
    pet.name ?
    (
    <View style={styles.container}>
      <View style={styles.titlebox}>
        <Text style={styles.titletext}>{pet.name}</Text>
      </View>
      {
        list.length > 0 ?
        <ScrollView style={[styles.scroll,{flexGrow:1}]}>
          <FlatList
            data={list}
            renderItem={ ({item}) => <Item {...item} /> }
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


const Empty:FC<{message:string}> = (props) => (
    <View style={styles.msg}>
      <Text style={styles.msgtext}>
        {props.message}
      </Text>
    </View>
);


function Register(props:{add:Function, setRegister:Function, lista: any, setLista: Function}){
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<string>('');

  return (
    <View style={styles.registercontainer}>
      <View style={styles.box}>
        <Text style={styles.title}>CADASTRAR GASTO</Text>
        <View style={{marginTop:20}}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={styles.input}
            onChangeText={setName}
            value={name}
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
          <TouchableOpacity style={styles.button} onPress={()=>props.add(name.trim(),parseFloat(value))}>
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

const Loading:FC = () => (
  <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: '#FFC125'}}>
    <ActivityIndicator size="large" color="#666" />
  </View>
);


