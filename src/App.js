import React, { Component } from "react";
import axios from "axios";
import "semantic-ui-css/semantic.min.css";
import {
  Header,
  Icon,
  Button,
  Table,
  Container,
  Form,
  Segment
} from "semantic-ui-react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataKaryawanAPI: [],
      postDataKaryawanAPI: {
        id: 0,
        nama_karyawan: "",
        jabatan: "",
        jenis_kelamin: "",
        tanggal_lahir: ""
      },
      allowEdit: false
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.simpanId = this.simpanId.bind(this);
  }
  simpanId(e) {
    axios
      .get(`http://localhost:3004/data-karyawan/${e.target.value}`)
      .then(res => {
        this.setState({
          postDataKaryawanAPI: res.data,
          allowEdit: true
        });
      });
  }
  handleRemove(e) {
    fetch(`http://localhost:3004/data-karyawan/${e.target.value}`, {
      method: "DELETE"
    }).then(res => this.reloadData());
  }
  handleSubmit() {
    if (this.state.allowEdit === false) {
      axios
        .post(
          `http://localhost:3004/data-karyawan`,
          this.state.postDataKaryawanAPI
        )
        .then(() => {
          this.reloadData();
          this.bersihkanKolom();
        });
    } else {
      axios
        .put(
          `http://localhost:3004/data-karyawan/${this.state.postDataKaryawanAPI.id}`,
          this.state.postDataKaryawanAPI
        )
        .then(() => {
          this.reloadData();
          this.bersihkanKolom();
        });
    }
  }
  handleInput(e) {
    let newDataKaryawanAPI = { ...this.state.postDataKaryawanAPI };
    if (this.state.allowEdit === false) {
      newDataKaryawanAPI["id"] = new Date().getTime();
    }
    newDataKaryawanAPI[e.target.name] = e.target.value;
    this.setState({ postDataKaryawanAPI: newDataKaryawanAPI });
  }
  bersihkanKolom = () => {
    let newDataKaryawanAPI = { ...this.state.postDataKaryawanAPI };
    newDataKaryawanAPI["id"] = "";
    newDataKaryawanAPI["nama_karyawan"] = "";
    newDataKaryawanAPI["jabatan"] = "";
    newDataKaryawanAPI["jenis_kelamin"] = "";
    newDataKaryawanAPI["tanggal_lahir"] = "";
    this.setState({
      postDataKaryawanAPI: newDataKaryawanAPI
    });
  };
  reloadData = () => {
    axios.get(`http://localhost:3004/data-karyawan`).then(res => {
      this.setState({ dataKaryawanAPI: res.data, allowEdit: false });
    });
  };
  componentDidMount = () => {
    this.reloadData();
  };
  render() {
    return (
      <div>
        <Container style={{ marginTop: 20 }}>
          <Header as="h2" textAlign="center">
            <Icon name="users" circular /> Data Karyawan
          </Header>
          <Form>
            <Form.Group widths="equal">
              <Form.Input
                fluid
                label="Nama Karyawan"
                name="nama_karyawan"
                value={this.state.postDataKaryawanAPI.nama_karyawan}
                placeholder="Input Nama"
                onChange={this.handleInput}
              />
              <Form.Input
                fluid
                label="Jabatan"
                name="jabatan"
                value={this.state.postDataKaryawanAPI.jabatan}
                placeholder="Input Jabatan"
                onChange={this.handleInput}
              />
              <Form.Input
                fluid
                label="Jenis Kelamin"
                name="jenis_kelamin"
                placeholder="Input Jenis Kelamin"
                value={this.state.postDataKaryawanAPI.jenis_kelamin}
                onChange={this.handleInput}
              />
              <Form.Input
                type="date"
                fluid
                label="Tanggal Lahir"
                name="tanggal_lahir"
                value={this.state.postDataKaryawanAPI.tanggal_lahir}
                placeholder="Input Tgl Lahir"
                onChange={this.handleInput}
              />
            </Form.Group>
            <Form.Button
              fluid
              color="green"
              type="submit"
              onClick={this.handleSubmit}
            >
              Add or Save
            </Form.Button>
          </Form>
          <Segment textAlign="center">
            Mohon jangan klik tombol Add or Save{" "}
            <b>sebelum data diatas terisi!</b>{" "}
            <mark>Jika dilakukan maka gaji akan dipotong</mark>
          </Segment>
          <Table celled striped textAlign="center">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell>Nama</Table.HeaderCell>
                <Table.HeaderCell>Divisi</Table.HeaderCell>
                <Table.HeaderCell>Jenis Kelamin</Table.HeaderCell>
                <Table.HeaderCell>Tanggal Lahir</Table.HeaderCell>
                <Table.HeaderCell colSpan="2">Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.dataKaryawanAPI.map((data, index) => {
                return (
                  <Table.Row key={index}>
                    <Table.Cell>{data.id}</Table.Cell>
                    <Table.Cell>{data.nama_karyawan}</Table.Cell>
                    <Table.Cell>{data.jabatan}</Table.Cell>
                    <Table.Cell>{data.jenis_kelamin}</Table.Cell>
                    <Table.Cell>{data.tanggal_lahir}</Table.Cell>
                    <Table.Cell>
                      <Button
                        primary
                        type="submit"
                        value={data.id}
                        onClick={this.simpanId}
                      >
                        Edit Data
                      </Button>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        secondary
                        type="submit"
                        value={data.id}
                        onClick={this.handleRemove}
                      >
                        Delete Data
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Container>
      </div>
    );
  }
}

export default App;
