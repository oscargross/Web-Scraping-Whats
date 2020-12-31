import React, { Component } from 'react'
import Head from 'next/head'
import InputMask from 'react-input-mask';
import { FaCheckCircle } from 'react-icons/fa';
import axios from 'axios'
import styles from '../styles/Home.module.css'
import Banner from './banner'
import { Container, Form, Button, Spinner, Alert, Table } from 'react-bootstrap'
import ButtonJS from './utils/buttonJS'

export default class Home extends Component {

  state = {
    login: '',
    password: '',
    inicialDate: '',
    finalDate: '',
    textarea: '',
    loading: false,
    error: false,
    msg: "",
    listNames: [],
    
  };   


  onChangeInput = (field, ev) => {
    this.setState({ [field]: ev.target.value })
  }

  sendForm = async event => {
    event.preventDefault()
    const { login, password, textarea, inicialDate, finalDate } = this.state;

    const dateI = inicialDate.split("-")
    const dateF = finalDate.split("-")

    const inicialDateFomated = dateI[2] + '/' + dateI[1] + '/' + dateI[0]
    const finalDateFomated = dateF[2] + '/' + dateF[1] + '/' + dateF[0]

    this.setState({ error: false })
    this.setState({ loading: true })
    await axios.post('/api', { login, password, inicialDateFomated, finalDateFomated, textarea }).then((res) => {
      const returnMessage = res.data.message
      const returnlistNames = res.data.list

      returnMessage === false
        ? this.successReturn(returnlistNames)
        : this.failReturn(returnMessage)
    })
  }

  successReturn = (res) => {
    this.setState({ loading: false })

    const {listNames} = this.state;    
    this.setState({ listNames: res })
    
  }

  failReturn = (res) => {
    this.setState({ loading: false })
    this.setState({ msg: res })
    this.setState({ error: true })
  }

  
  sendNumbers = () => {
     const { listNames } = this.state;
// console.log("msg" in this.state)
 console.log(this.state);

// delete this.state.login
// delete this.state.password
// delete this.state.inicialDate
// delete this.state.finalDate
// delete this.state.loading
// delete this.state.msg
// delete this.state.listNames
// delete this.state.error

// console.log(this.state);
const numbers = []
for (let i = 0; i < listNames.length; i++) {
  if(listNames[i] in this.state)
  
    
    numbers.push(this.state[listNames[i]]) 

    delete this.state.listNames[i]

}
    console.log(numbers) 

  }

  render() {
    const { loading } = this.state;
    const { error } = this.state;
    const { msg } = this.state;
    const { listNames } = this.state;
    const { value} = this.state;
    



    return (
      <div className={styles.container}>
        <Head>
          <title>Bio-Preventivas</title>
          <link rel="icon" href="/assets/biofavicon.png" />
        </Head>

        <Container>


          {listNames == ""
            ? <>
            <Banner />

          {error
            ? <Alert style={{ width: '80%' }} variant="danger">{msg}</Alert>
            : <></>}
            <Form onSubmit={this.sendForm}>
              <Form.Group>
                <Form.Label>Login Elevor</Form.Label>
                <Form.Control type="text" id="login" name="login" placeholder="Login Elevor" onChange={(ev) => this.onChangeInput('login', ev)} />

              </Form.Group>

              <Form.Group>
                <Form.Label>Senha Elevor</Form.Label>
                <Form.Control type="password" id="password" name="password" placeholder="Senha Elevor" onChange={(ev) => this.onChangeInput('password', ev)} />
              </Form.Group>

              <Form.Group>
                <Form.Label>Data inicial das tarefas agendadas</Form.Label>
                <Form.Control required type="date" id="inicialDate" name="inicialDate" placeholder="Data Inicial" onChange={(ev) => this.onChangeInput('inicialDate', ev)} />
              </Form.Group>

              <Form.Group>
                <Form.Label>Data Final das tarefas agendadas</Form.Label>
                <Form.Control required type="date" id="finalDate" name="finalDate" placeholder="Data Final" onChange={(ev) => this.onChangeInput('finalDate', ev)} />
              </Form.Group>              

              <ButtonJS text="Acessar" loading={loading}></ButtonJS>

            </Form></>
            :<>
  <Banner props={"Após preencher os campos com os números, fique preparado com a tela de leitura do QRCode do What'sApp Web de seu celular para escaneá-lo rapidamente."}/>

            <Table striped responsive="xl" bordered size="xl">
              <thead>
                <tr style={{ textAlign: "center" }}>
                  <th>Nome</th>
                  <th>WhatsApp</th>
                  <th>Concluído</th>
                </tr>
              </thead>

              <tbody>{listNames.map((h, i) =>
                <tr key={i} style={{
                  textAlign: "center"
                }}><td><h3 style={{ fontSize: "80%", fontWeight: "bold",  }}>{h}</h3></td>
                  <td><InputMask mask="(99) 99999-9999"   value={value} onChange={(ev) => this.onChangeInput(listNames[i], ev)} placeholder="Telefone Whats"/>
                    </td>
                  <td><FaCheckCircle style={{ color: "green" }} /></td>
                </tr>
              )}</tbody>
            </Table>
            <Form.Group>
                <Form.Label>Mensagem</Form.Label>
                <Form.Control as="textarea" id="textarea" name="textarea" rows={3} onChange={(ev) => this.onChangeInput('textarea', ev)} />
              </Form.Group>

              <ButtonJS text="Clique para prosseguir" loading={loading} onClickFunction={this.sendNumbers}></ButtonJS> 


            </>}


          <img id="img" src='/assets/biocare.jpg'></img>
        </Container>
      </div>
    )
  }
}
