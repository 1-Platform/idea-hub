/* eslint-disable @typescript-eslint/no-explicit-any */
import { CSSProperties, useEffect, useState, useCallback } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';

import { Menu, MenuList, MenuGroup, MenuItem, Split, SplitItem } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { useQuery } from 'hooks';
import { usePouchDB } from 'context';
import { TagDoc } from 'pouchDB/types';

interface TagCount {
  isLoading: boolean;
  data: Array<{
    id: any;
    key: any;
    value: any;
    doc?: PouchDB.Core.ExistingDocument<TagDoc & PouchDB.Core.AllDocsMeta>;
  }>;
}

export const Categories = (): JSX.Element => {
  const { tag } = usePouchDB();
  const [tagCount, setTagCount] = useState<TagCount>({ isLoading: true, data: [] });
  const userInfo = window?.OpAuthHelper?.getUserInfo();

  // url manipulation hooks
  const navigate = useNavigate();
  const query = useQuery();
  const author = query.get('author');
  const category = query.get('category');

  useEffect(() => {
    handleFetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchTags = useCallback(async () => {
    try {
      const { rows } = await tag.getTagCounts();
      rows.sort((a, b) => b.value - a.value).splice(10);
      setTagCount({ isLoading: false, data: rows });
    } catch (error) {
      setTagCount({ isLoading: false, data: [] });
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMenuClick = useCallback(
    (key: 'author' | 'category', value: string | null) => {
      const params: Record<string, string> = {};
      if (author) params.author = author;
      if (category) params.category = category;
      if (value) {
        params[key] = value;
      } else {
        delete params[key];
      }
      navigate({
        pathname: '',
        search: '?' + createSearchParams(params),
      });
    },
    [category, author, navigate]
  );

  return (
    <Menu style={{ '--pf-c-menu--BoxShadow': 0 } as CSSProperties}>
      <MenuGroup>
        <MenuList className="pf-u-pt-0">
          <MenuItem
            className={css({ 'pf-u-font-weight-bold': author === userInfo?.rhatUUID })}
            onClick={() => handleMenuClick('author', userInfo?.rhatUUID)}
          >
            My ideas
          </MenuItem>

          <MenuItem
            className={css({ 'pf-u-font-weight-bold': !Boolean(author) })}
            onClick={() => handleMenuClick('author', null)}
          >
            Discover
          </MenuItem>
        </MenuList>
      </MenuGroup>
      <MenuGroup label="Categories">
        <MenuList>
          {tagCount.data.map(({ key, value }) => (
            <MenuItem
              key={key}
              onClick={() => handleMenuClick('category', category === key ? null : key)}
            >
              <Split>
                <SplitItem
                  className={css({
                    'pf-u-font-weight-bold': category === key,
                    capitalize: true,
                  })}
                >
                  {key}
                </SplitItem>
                <SplitItem isFilled />
                <SplitItem style={{ opacity: 0.4 }}>{value}</SplitItem>
              </Split>
            </MenuItem>
          ))}
        </MenuList>
      </MenuGroup>
    </Menu>
  );
};
