"use client";
import {useEffect, useState} from 'react';
import {useSearchParams} from "next/navigation";
import { Kanit } from "next/font/google";
import Image from "next/image";
import logo from "public/logo.jpg";
import Link from "next/link";
import axios from 'axios';
import {AnimatePresence, motion} from "framer-motion";

const kanit = Kanit({
    subsets: ["latin"],
    weight: ["400", "700", "800"]
});


export default function Page() {
    // const NEWS_API_KEY = process.env.NEWS_API_KEY;
    const searchParams = useSearchParams();
    const search = searchParams.get('search')
    const [query, setQuery] = useState(search ? search : '');
    const [factChecks, setFactChecks] = useState([]);
    const [articles, setArticles] = useState([]);
    const [isSearched, setIsSearched] = useState(false);


    const getArticles = async (query) => {
        const response = await axios.get(
            `https://newsapi.org/v2/everything?q=${query}&sortBy=popularity&page=1&pagesize=10&language=en&apiKey=c727a28d08b84681a92931c904b93a02`
        );
        setArticles(response.data.articles);
    };

    async function handleSearch() {
        const response = await fetch(`/api/factcheck?query=${encodeURIComponent(query)}`);
        const results = await response.json();
        setFactChecks(results);
        await getArticles(query)
        setIsSearched(true)
    }

    function clearButton() {
        setFactChecks([])
        setIsSearched(false)
        setQuery('')
    }

    useEffect(()=> {
        if (query) {
            handleSearch()
        } else {
            setFactChecks([])
        }
    }, [])

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }

    // if (query) {
    //     handleSearch();
    // }

    return (
        <main className={`${kanit.className} relative w-full min-h-[100svh] flex flex-col justify-center items-center gap-10 py-16 px-10`}>

            <nav className={"bg-[#f1f1f1] w-full shadow-md fixed top-0 py-2 px-4 flex flex-row justify-between items-center z-10"}>
                <Link href={"/"}><Image className={"rounded-full w-auto h-10 border-2 border-[#121212]"} width={100} height={100} src={logo} alt={"Fake Or Not Logo"} /></Link>
                <div className={"flex flex-row gap-4"}>
                    <Link href={"/motive"}>Motive</Link>
                    <Link href={"/usage"}>How to use?</Link>
                    <a target={"_blank"} href="https://github.com/BreakTos/Fake-News-Detection/">Download Extension</a>
                </div>
            </nav>

            <motion.div layout className={""}>
                <h1 className={"text-9xl text-[#121212]"}>News Verifier</h1>
            </motion.div>

            <motion.div layout className={"flex flex-row relative gap-2"}>
                <input required onKeyPress={handleKeyPress} autoFocus={true} placeholder={"Write Your Query Here..."} className={"px-5 border border-black rounded-lg min-w-[38vw] h-[5vh]"} type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
                <button className={" hover:bg-[#62C370] h-[5vh] px-5 right-0 border border-black rounded-lg"} onClick={handleSearch}>Search</button>
            </motion.div>

            {isSearched &&
                // <div className={"flex flex-row min-w-[40vw] justify-between gap-10"}>
                //     <p>Related News: {factChecks.length}</p>
                //     <button onClick={clearButton}>Clear</button>
                // </div>
                <motion.div initial={{opacity: 0}} animate={{opacity:1}} className={"flex lg:flex-row flex-col gap-4"}>
                    <ul className={"flex flex-col gap-6 lg:w-2/3 h-fit"}>
                        <div className={"border-b text-lg"}>
                            <h2>Fact Checks</h2>
                        </div>
                        {/*{factChecks.length === 0 && <li>No results</li>}*/}
                        {factChecks.map((factCheck) => (
                            // eslint-disable-next-line react/jsx-key
                            <AnimatePresence>
                                <motion.li initial={{opacity: 0}} animate={{opacity: 1}} transition={{ duration: 0.5 }} layout className={"border border-black rounded-lg py-4 px-6 flex flex-row justify-between"} key={factCheck.claimReview[0].url}>
                                    <a target={"_blank"} className={"line-clamp-1"} href={factCheck.claimReview[0].url}>{factCheck.claimReview[0].title}</a>
                                    {factCheck.claimReview[0].textualRating === "True" ?
                                        <p className={"ml-10 text-green-500 line-clamp-1"}>{factCheck.claimReview[0].textualRating}</p> :
                                        <p className={"ml-10 text-red-500 line-clamp-1"}>{factCheck.claimReview[0].textualRating}</p>}
                                    {/*<p className={"ml-10"}>{factCheck.claimReview[0].textualRating}</p>*/}
                                </motion.li>
                            </AnimatePresence>
                        ))}
                    </ul>

                    {/*<button onClick={handleButtonClick}>Get Articles</button>*/}
                    <div className={"flex flex-col gap-6 lg:w-fit h-fit"}>
                        <div className={"border-b text-lg"}>
                            <h2>Relevant News</h2>
                        </div>
                        {articles.map((article) => (
                            // eslint-disable-next-line react/jsx-key
                            <AnimatePresence>
                                <motion.div className={"border border-black rounded-lg py-4 px-6 h-max"} initial={{opacity: 0}} animate={{opacity: 1}} transition={{ duration: 0.5 }} layout>
                                    <a target={"_blank"} key={article.title} href={article.url}><h2>{article.title}</h2></a>
                                </motion.div>
                            </AnimatePresence>
                        ))}
                    </div>
                </motion.div>
            }


        </main>
    );
}