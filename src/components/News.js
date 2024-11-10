import React, {useEffect,useState} from 'react'

import NewsItem from './NewsItem'
import { Spineer } from './Spineer';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props)=> {

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  

  const capitalfirstlater = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


   const updateNews = async () => {
      props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=fcc0f35c926849a2a9305b5986a05a63&page=${page}&pageSize=${props.pageSize}`;
    
    setLoading(true)
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json()
    props.setProgress(50);
    console.log(parsedData);

    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)
   
      props.setProgress(100);
  }
  useEffect(()=>{
    updateNews();
     document.title = `${capitalfirstlater(props.category)} - NewsMonkey`;
  },[])

  
  // const handlePrevClick = async () => {
  //   setPage(page-1)
  //   updateNews();
  // }

  // const handleNextClick = async () => {
  //   setPage(page+1)
  //   updateNews();

  // }
      const fetchMoreData = async ()=>{
        
        
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=fcc0f35c926849a2a9305b5986a05a63&page=${page+1}&pageSize=${props.pageSize}`;
        setPage(page+1)
    let data = await fetch(url);
    let parsedData = await data.json()
    console.log(parsedData);
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)

    
      }

  

    return (
      <>
        <h1 className='text-center' style={{marginTop: "80px"}}>News Monkey -Top {capitalfirstlater(props.category)} headlines</h1>
        {loading && <Spineer/>}

        <InfiniteScroll
          dataLength={  articles.length }
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spineer/>}
          
          
        >
            <div className='container'>
            <div className="row">
            {articles.map((element) => {
              // articles={articles.length === 0 ?}
                return <div className="col-md-4" key={element.url}>
                <NewsItem  title={element.title ? element.title : ""}
                 description={element.description ? element.description : ""}
                  imageUrl={element.urlToImage} newsUrl={element.url}
                   author={element.author} date={element.publishedAt}
                    source={element.source.name} />

              </div>
            })}
          </div>
          </div>
        </InfiniteScroll>
        


      </>


    )
  
}

News.defaultProps = {

  country: 'us',
  pageSize: 8,
  category: 'General',
}

News.propTypes = {

  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,

}


export default News