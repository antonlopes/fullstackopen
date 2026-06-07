
const PersonForm = ({handleChange, newName, addContact}) => {

    return(
        <div>
            <form onSubmit={addContact}>
                <div>
                name: <input name="name" onChange={handleChange} value={newName.name} />
                </div>
                <div>
                number: <input name="number" onChange={handleChange} value={newName.number}/>
                </div>
                <div>
                <button type="submit">add</button>
                </div>
            </form>
        </div>
    )
}

export default PersonForm