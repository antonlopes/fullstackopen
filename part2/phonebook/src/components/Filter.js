
const Filter = ({searchChange, search}) => {


    return (
        <div>
          filter shown with: 
          <input name="search" onChange={searchChange} value={search}/>
        </div>
    )
}

export default Filter