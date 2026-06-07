const Header = ({name}) => <h1>{name}</h1>


const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

const Content = ({ parts }) => (
  <div>
    {parts.map(part => (
      <Part key={part.id} part={part} />
    ))}
  </div>
)

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => {
    return sum+part.exercises;
  }, 0)

  return (
    <p>
      <strong>total of {total} exercises</strong>
    </p>
  )
}



const Course = ({ course }) => (
  <>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts}/>
  </>
)

export default Course