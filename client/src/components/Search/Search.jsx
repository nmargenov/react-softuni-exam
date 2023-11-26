import { useEffect, useState } from "react";
import { useLocation } from "react-router"
import { searchUsers } from "../../services/userService";
import { NotFound } from "../NotFound/NotFound";
import { SearchItem } from "./SearchItem/SearchItem";
import styles from "./search.module.css";
import { GlobalSpinner } from "../Spinners/GlobalSpinner/GlobalSpinner";

export const Search = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search');

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if(!search || search.length<1){
            setHasError(true);
            return;
        }
        setIsLoading(true);
        searchUsers(search)
            .then((data) => {
                setHasError(false);
                setUsers(data);
                setIsLoading(false);
            }).catch((err) => {
                setIsLoading(false);
                setHasError(true);
            })
    }, [search])

    return (
        <>
            {isLoading && <div className={styles['global-spinner']}><GlobalSpinner/></div>}
            {!isLoading && hasError && <NotFound />}
            {!isLoading && !hasError &&
                <div className={styles['search-main']}>
                    {users.length > 0 && <div className={styles['search-found']}>
                        <h1>{users.length} results found for {search}</h1>
                        {users.map(u => <SearchItem key={u._id} {...u} />)}
                        </div>}
                    {users.length === 0 && <h1>No results were found for {search}</h1>}
                </div>}
        </>
    )
}