


export default function PopUpWindow(props) {

    return (
        <div className="pb-10 pl-10 pt-2 pr-2 bg-popUpBg fixed top-1/2 left-1/2 w-96 border-gray-800 border-2 rounded-lg transform -translate-x-1/2 -translate-y-1/2">
   
            <div className="flex flex-row w-full">
                <button onClick={props.onClose} className="py-1 px-3 cursor-pointer  ml-auto ">X</button>
            </div>
            <span className="text-defaultText my-6">
                {props.message}
            </span>
            { props.error &&
                <span className="text-error-800"> Error: {props.error} </span>
            }
            { props.children &&
                <div className="flex flex-col">
                    {props.children}
                </div>
            }
        </div>
    )
}