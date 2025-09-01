function Box({fieldName, fieldText}) {
    return (
        <div className="text-[#000] mb-6">
            <h1 className="font-semibold text-black select-none">{fieldName}</h1>
            <p className="bg-middleColor rounded-lg py-3 px-3 overflow-hidden select-none">{fieldText}</p>
        </div>
    )
}

export default Box
