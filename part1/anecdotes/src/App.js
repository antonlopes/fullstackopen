import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'Se fazer algo dói, faça isso com mais frequência.',
    'Contratar mão de obra para um projeto de software que já está atrasado, faz com que se atrase mais ainda!',
    'Os primeiros 90% do código correspondem aos primeiros 10% do tempo de desenvolvimento... Os outros 10% do código correspondem aos outros 90% do tempo de desenvolvimento.',
    'Qualquer tolo escreve código que um computador consegue entender. Bons programadores escrevem código que humanos conseguem entender.',
    'Otimização prematura é a raiz de todo o mal.',
    'Antes de mais nada, depurar é duas vezes mais difícil do que escrever o código. Portanto, se você escrever o código da forma mais inteligente possível, você, por definição, não é inteligente o suficiente para depurá-lo.',
    'Programar sem o uso extremamente intenso do console.log é o mesmo que um médico se recusar a usar raio-x ou testes sanguíneos ao diagnosticar pacientes.',
    'A única maneira de ir rápido é ir bem.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [pontos, setPontos] = useState(Array(anecdotes.length).fill(0));

  const handleNextAnecdote = () => {
    const index = Math.floor(Math.random() * anecdotes.length);
    setSelected(index);
  }
    
  const handleVote = () => {
    const copia = [...pontos]
    copia[selected] += 1
    setPontos(copia)
  }       

  const maiorValor = Math.max(...pontos);
  const indiceDOMaior = pontos.indexOf(maiorValor);

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <p>{anecdotes[selected]}</p>
      <p>has {pontos[selected]} votes</p>
      <button onClick={handleVote}>vote</button>
      <button onClick={handleNextAnecdote}>next anecdotes</button>
      
      {maiorValor > 0 ? (
        <>
          <h2>Anecdote with most votes</h2>
          <p>{anecdotes[indiceDOMaior]}</p>
          <p>has {pontos[indiceDOMaior]} votes</p>
        </>
      ) : (
        <p>No votes registered yet.</p>
      )}
      
      
      
    </div>
  )
}

export default App