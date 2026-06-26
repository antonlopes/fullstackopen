import { useState } from 'react'

const Historico = (props) => {
  if (props.todosOsCliques.length === 0) {
    return (
      <div>
        Clique em um dos botões para usar a aplicação!
      </div>
    )
  }
  return (
    <div>
      Histórico de cliques nos botões: {props.todosOsCliques.join(' ')}
    </div>
  )
}

const App = () => {
    const [esquerda, setEsquerda] = useState(0)
    const [direita, setDireita] = useState(0)
    const [todosOsCliques, setTodos] = useState([])
    const [total, setTotal] = useState(0)

    const handleCliqueEsquerda = () => {
        setTodos(todosOsCliques.concat('E'))
        setEsquerda(esquerda + 1)
        setTotal(esquerda + direita)
    }

    const handleCliqueDireita = () => {
        setDireita(direita + 1)
        setTotal(esquerda + direita)
    }

  return (
    <div>
      {esquerda}
      <button onClick={handleCliqueEsquerda}>Esquerda</button>
      <button onClick={handleCliqueDireita}>Direita</button>
      {direita}

      <Historico todosOsCliques={todosOsCliques} />
    </div>
  )
}

export default App