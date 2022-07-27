import Head from 'next/head';
import FacetList from './FacetList';
import ProductList from '../ShopCommon/ProductList';
import SearchControls from './SearchControls';
import { ChangeEvent, useState } from 'react';
import {
  SearchResultsPageNumberChangedActionPayload,
  SearchResultsFacetClickedChangedActionPayload,
  SearchResultsSortChangedActionPayload,
} from '@sitecore-discover/widgets';
import CategoryHero from '../Products/CategoryHero';
import { getCategoryByUrlPath } from '../../helpers/CategoriesDataHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { FullPageSearchResultsProps } from './FullPageSearch';

type FullPageSearchContentProps = Partial<FullPageSearchResultsProps> & {
  urlPath: string;
  onSearchInputChange: (s: string) => void;
};

const FullPageSearchContent = ({
  rfkId,
  error,
  loaded,
  loading,
  page,
  totalPages,
  totalItems,
  sortType,
  sortDirection,
  sortChoices,
  products,
  facets,
  onFacetClick,
  onClearFilters,
  onPageNumberChange,
  onSortChange,
  onSearchInputChange,
  urlPath,
}: FullPageSearchContentProps): JSX.Element => {
  const isCategoryProductListingPage = rfkId === 'rfkid_10';

  const [toggle, setToggle] = useState(false);

  if (error) {
    return <div>Response error</div>;
  }

  const handleFacetClick = (payload: SearchResultsFacetClickedChangedActionPayload) => {
    onFacetClick(payload);
  };

  const handleFacetClear = () => {
    onClearFilters();
  };

  const handlePageNumberChange = (pageNumber: string) => {
    const pageNo: SearchResultsPageNumberChangedActionPayload = {
      rfkId,
      page: Number(pageNumber),
    };
    onPageNumberChange(pageNo);
  };

  const handleSortChange = (payload: SearchResultsSortChangedActionPayload) => {
    onSortChange(payload);
  };

  const handleToggleClick = () => {
    const isVisible = !toggle;
    setToggle(isVisible);
    document.body.classList.toggle('shop-facet-panel-open', isVisible);
  };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchInputChange(e.target.value || '');
  };

  const numberOfResults = !loading && totalPages > 0 && (
    <div className="items-num">{totalItems} items</div>
  );

  const noResultsMessage = totalItems === 0 && 'No results found';

  const sortFacetProps = {
    sortChoices,
    sortType,
    sortDirection,
    onSortChange: handleSortChange,
  };

  const category = getCategoryByUrlPath(urlPath);

  const pageTitle = isCategoryProductListingPage && category ? category.name : 'Products';

  const categoryHero = isCategoryProductListingPage && category && (
    <CategoryHero category={category} />
  );

  return (
    <>
      <Head>
        <title>PLAY! SHOP - {pageTitle}</title>
      </Head>

      {categoryHero}
      <section className="full-page-search section">
        <div className="full-page-search-container">
          <div className="facet-panel-mask"></div>
          <div className="full-page-search-left">
            <FacetList
              facets={facets}
              onFacetClick={handleFacetClick}
              onClear={handleFacetClear}
              sortFacetProps={sortFacetProps}
              onToggleClick={handleToggleClick}
              isCategoryProductListingPage={isCategoryProductListingPage}
              onSearchInputChange={handleSearchInputChange}
            />
            <div className="button-container">
              <button className="btn-main" onClick={handleToggleClick}>
                Show {totalItems} results
              </button>
            </div>
          </div>
          <div className="full-page-search-right">
            <div data-page={page}>
              <div className="full-page-search-header">
                <div className="full-page-search-controls">
                  {numberOfResults}
                  <SearchControls
                    totalPages={totalPages}
                    page={page}
                    sortChoices={sortChoices}
                    sortType={sortType}
                    sortDirection={sortDirection}
                    onPageNumberChange={handlePageNumberChange}
                    onSortChange={handleSortChange}
                  />
                </div>
                <button className="btn-main facet-container-toggle" onClick={handleToggleClick}>
                  <FontAwesomeIcon icon={faSlidersH} />
                  Filter
                </button>
              </div>
              {noResultsMessage}
              <ProductList products={products} loaded={loaded} loading={loading} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FullPageSearchContent;
