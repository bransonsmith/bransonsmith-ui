import { Helmet } from 'react-helmet';
import TeamSelector from "../GingerbreadCompetition/Pages/TeamSelector";

export default function GingerbreadCompetitionPage() {

        return (
            <div className="GingerbreadCompetitionPage">
            <Helmet>
            <title> Gingerbread Competition</title>
            </Helmet>
            <h1 className="title">Gingerbread Competition</h1>
            <div className="description">
                    <TeamSelector />
                </div>
        </div>
    )

}


   

