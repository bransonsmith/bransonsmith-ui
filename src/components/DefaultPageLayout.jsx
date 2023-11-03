


export default function DefaultPageLayout(props) {

    return <div className="w-full max-w-screen-md mx-auto my-8 bg-contentBg p-[min(5vw,50px)] rounded flex flex-col">
        {props.children}
    </div>
}
