
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";

export default function SecondaryHeader(props) {
    return <div> { props.contents
    ?   <div className="page-header">
            <div className="content-container">
                {props.contents}
            </div>
        </div>
    :   <>Header NO content</>
    }
    <Outlet />
    </div>
}