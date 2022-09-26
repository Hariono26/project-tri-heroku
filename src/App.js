import { Button, Form, Table, Modal } from "react-bootstrap";
import Axios from 'axios'
import { useState, useRef } from 'react'


function App() {

  const [tokenData, setTokenData] = useState({})
  const [accLogin, setAcclogin] = useState(false)
  const [projectData, setProjectData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(0)
  const [itemPerPage] = useState(5)

  const username = useRef()
  const password = useRef()
  const projectDesc = useRef()
  const projectName = useRef()

  const onLogin = () => {
    let userInput = username.current.value
    let passInput = password.current.value
    username.current.value && password.current.value ?
      Axios.post('https://frontend-test-backend.tritronik.com/Auth/login', {
        username: `${userInput}`,
        password: `${passInput}`
      })
        .then(res => {
          setTokenData(res.data)
          setAcclogin(true)
        })
        .catch(err => alert('maaf input yg anda masukkan salah'))
      :
      alert('mohon lengkapi semua data')
  }

  const onShowProject = (token) => {
    Axios.get('https://frontend-test-backend.tritronik.com/v1/projects/', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setProjectData(res.data.content)
        setMaxPage(Math.ceil((res.data.content.length) / itemPerPage))
      })
  }

  const showTableBody = () => {
    let beginIndex = (page - 1) * itemPerPage
    let currentProject = projectData.slice(beginIndex, beginIndex + itemPerPage)
    return (
      <tbody>
        {currentProject.map(item => {
          return (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.owner}</td>
              <td>
                <Button style={{marginRight:'10px'}} variant='warning' onClick={() => alert('Coming Soon')}>Edit</Button>
                <Button variant='danger' onClick={() => onDelete(item.id)}>Hapus</Button>
              </td>
            </tr>
          )
        })}
      </tbody>
    )
  }

  const onNext = () => {
    setPage(page + 1)
  }

  const onPrev = () => {
    setPage(page - 1)
  }

  const onDelete = (id) => {
    Axios.delete(`https://frontend-test-backend.tritronik.com/v1/projects/${id}`, { headers: { Authorization: `Bearer ${tokenData.access_token}` } })
      .then(res => {
        onShowProject(tokenData.access_token)
      })
  }

  const onAdd = () => {
    setShowModal(true)
  }

  const onAddOk = () => {
    let newProjectData = {
      "component": "string",
      "description": `${projectDesc.current.value}`,
      "id": 0,
      "name": `${projectName.current.value}`,
      "owner": "string",
      "pages": [
        {
          "component": "string",
          "description": "string",
          "iconName": "string",
          "id": 0,
          "miniName": "string",
          "name": "string",
          "pageType": "DASHBOARD",
          "path": "string",
          "permission": "string",
          "projectId": 0,
          "title": "string",
          "visibleInMenu": true
        }
      ],
      "path": "string"
    }
    Axios.post(`https://frontend-test-backend.tritronik.com/v1/projects/`, newProjectData, { headers: { Authorization: `Bearer ${tokenData.access_token}` } })
      .then(res => {
        onShowProject(tokenData.access_token)
      })
    setShowModal(false)
  }

  if (accLogin === true) {
    return (
      <div>
        <Button variant='success' style={{marginRight:'10px'}} onClick={() => onShowProject(tokenData.access_token)}>Tampilkan Daftar Project</Button>
        <Button variant='primary' disabled={maxPage === 0 ? true : false} onClick={onAdd}>Tambah Project Baru</Button>
        <Table bordered striped>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Deskripsi</th>
              <th>Pemilik</th>
              <th>Opsi</th>
            </tr>
          </thead>
          {showTableBody()}
        </Table>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2%' }}>
          <Button disabled={page <= 1 ? true : false} onClick={onPrev}>prev</Button>
          <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>Page {page} of {maxPage}</div>
          <Button disabled={page >= maxPage ? true : false} onClick={onNext}>next</Button>
        </div>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={showModal}
          onHide={() => setShowModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Masukkan Data Project Baru
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Input Nama Project</Form.Label>
                <Form.Control type="text" placeholder="Masukkan Nama Project" defaultValue='new project' ref={projectName} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Input Deskripsi</Form.Label>
                <Form.Control type="text" placeholder="Masukkan Deskripsi" defaultValue='new description' ref={projectDesc} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={onAddOk}>OK</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  } else {
    return (
      <div >
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Masukkan Username" ref={username} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Masukkan Password" ref={password} />
          </Form.Group>

          <Button variant="primary" onClick={onLogin}>
            Login
          </Button>
        </Form>
      </div>
    );
  }
}

export default App;
