import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import { makeRequestToApi } from '../Services/ApiService';
import CategoryBrowser from '../Components/Budget/Category/CategoryBrowser';
import PaymentMethodBrowser from '../Components/Budget/PaymentMethod/PaymentMethodBrowser';
import PlaceBrowser from '../Components/Budget/Place/PlaceBrowser';
import TagBrowser from '../Components/Budget/Tag/TagBrowser';
import TransactionBrowser from '../Components/Budget/Transaction/TransactionBrowser';
import TransactionInput from '../Components/Budget/TransactionInput';
import { getEntities } from '../Components/Budget/EntityService';

export default function BudgetPage(props) {

    const [selectedTab, setSelectedTab] = useState('Category');

    const [categories, setCategories] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [places, setPlaces] = useState([]);
    const [tags, setTags] = useState([]);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {

        const getAllEntities = async () => {
            const categories = await getEntities('Category');
            const paymentMethods = await getEntities('PaymentMethod');
            const places = await getEntities('Place');
            const tags = await getEntities('Tag');
            const transactions = await getEntities('Transaction');
            setCategories(categories.entities || []);
            setPaymentMethods(paymentMethods.entities || []);
            setPlaces(places.entities || []);
            setTags(tags.entities || []);
            setTransactions(transactions.entities || []);
        }

        getAllEntities();

    }, [])

    const RefreshEntities = async (entityName) => {

        const entities = await getEntities(entityName);
        switch (entityName) {
            case 'Category':
                setCategories(entities.entities || []);
                break;
            case 'PaymentMethod':
                setPaymentMethods(entities.entities || []);
                break;
            case 'Place':
                setPlaces(entities.entities || []);
                break;
            case 'Tag':
                setTags(entities.entities || []);
                break;
            case 'Transaction':
                setTransactions(entities.entities || []);
                break;
            default:
                break;
        }
    }

    return (
        <div className='w-[80vw] m-auto'>
            <Helmet>
                <title>Budget | Branson Smith</title>
                <meta name="description" content="Personal Budget Page" />
                <link rel="canonical" href={`https://www.bransonsmith.dev/budget`} />
            </Helmet>
            <div>
                <h1>Budget</h1>

                <TransactionInput />

                <div className="flex flex-row">
                    <button className={`w-1/2 ${selectedTab !== 'Category' ? 'bg-contentBg' : 'bg-defaultBg border-2 border-popUpBg border-b-0 rounded-none'}`} onClick={() => setSelectedTab('Category')}>Categories</button>
                    <button className={`w-1/2 ${selectedTab !== 'PaymentMethod' ? 'bg-contentBg' : 'bg-defaultBg border-2 border-popUpBg border-b-0 rounded-none'}`} onClick={() => setSelectedTab('PaymentMethod')}>Payment Methods</button>
                    <button className={`w-1/2 ${selectedTab !== 'Place' ? 'bg-contentBg' : 'bg-defaultBg border-2 border-popUpBg border-b-0 rounded-none'}`} onClick={() => setSelectedTab('Place')}>Places</button>
                    <button className={`w-1/2 ${selectedTab !== 'Tag' ? 'bg-contentBg' : 'bg-defaultBg border-2 border-popUpBg border-b-0 rounded-none'}`} onClick={() => setSelectedTab('Tag')}>Tags</button>
                    <button className={`w-1/2 ${selectedTab !== 'Transaction' ? 'bg-contentBg' : 'bg-defaultBg border-2 border-popUpBg border-b-0 rounded-none'}`} onClick={() => setSelectedTab('Transaction')}>Transactions</button>
                </div>
                { selectedTab === 'Category' && <CategoryBrowser RefreshEntities={() => RefreshEntities('Category')} categories={categories}/> }
                { selectedTab === 'PaymentMethod' && <PaymentMethodBrowser RefreshEntities={() => RefreshEntities('PaymentMethod')} paymentMethods={paymentMethods}/> }
                { selectedTab === 'Place' && <PlaceBrowser RefreshEntities={() => RefreshEntities('Place')} places={places} categories={categories}/> }
                { selectedTab === 'Tag' && <TagBrowser RefreshEntities={() => RefreshEntities('Tag')}/> }
                { selectedTab === 'Transaction' && <TransactionBrowser RefreshEntities={() => RefreshEntities('Transaction')} transactions={transactions} places={places} categories={categories}/> }
            </div>
        </div>
    )
} 