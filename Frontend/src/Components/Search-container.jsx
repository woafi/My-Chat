function Searchcontainer({ setSearchQuery, searchQuery }) {
    return (
        <div className='hidden px-2 py-5 sm:flex pointer-events-none sm:pointer-events-auto h-[80px] in'>
            <div className="flex border-2 border-secondary/50 rounded-2xl bg-middleColor focus-within:border-secondary hover:border-secondary">
                <span className="w-[35px] px-2 sm:w-[45px] py-1 flex justify-center items-center">
                    <lord-icon
                        src="https://cdn.lordicon.com/wjyqkiew.json"
                        trigger="loop"
                        stroke="bold"
                        state="loop-spin"
                        colors="primary:#121331,secondary:#b4b4b4"
                    >
                    </lord-icon>
                </span>
                <input className="hidden sm:block w-full py-1 focus:outline-none focus:placeholder-transparent" type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                />
            </div>
        </div>
    )
}

export default Searchcontainer;
