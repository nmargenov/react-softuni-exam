import styles from '../header.module.css';
import { useForm } from "../../../hooks/useForm";
import { useNavigate } from 'react-router';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react';
export const SearchBar = () => {
    const initialValues = {search:''}

    const navigate = useNavigate();

    const {values, setValues, onSubmitHandler, onInputChange} = useForm(initialValues);

    function onSubmit(e){
        onSubmitHandler(e);
        if(values.search<=0){
            return;
        }
        navigate(`/search?search=${values.search}`);
        setValues(initialValues);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSubmit(e);
        }
    };
    return (
        <div className={styles["search-div"]}>
            <form onSubmit={onSubmit}>
                <input onKeyDown={handleKeyDown} onChange={onInputChange} value={values.search} name="search" type="text" placeholder="Search user" />
                <button type="submit"><FontAwesomeIcon icon={faSearch} /></button>
            </form>
        </div>)
}