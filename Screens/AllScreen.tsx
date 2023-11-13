import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, View } from "react-native";
import Card from "../Components/Card";
import colors from "../Styles/colors";
import { Post } from "../utils/interfaces";
import { Endpoints } from "../utils/Endpoints";
import { customFetch } from "../utils/utils";
import Text from '../Components/Native/Text';
import {FlashList} from '@shopify/flash-list';

const AllScreen = ({ navigation }: any) => {
    const [cards, setCards] = useState<Post[]>([]);

    const page = useRef<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const stopped = useRef<boolean>(false);

    const refreshing = useRef<boolean>(false);

    useEffect(() => {
        fetchPosts(true);
    }, []);

    const fetchPosts = async (reset: boolean) => {
        //console.debug('fetch posts running');
        setLoading(true);
        let pageNow = page.current;
        if (reset) {
            page.current = 1;
            pageNow = 1;
        }
        try {
            const endpoint =
                Endpoints.getPostsByGroup +
                new URLSearchParams({
                  page: String(pageNow),
                  groupID: '647dca3dc2e7afc47081a7c9',
                  filterTime: 'all',
                  filter: 'trendy',
                  adminPassword: 'CandorDev345!',
                  user: '64a4ef50ed8b983a2f9957db',
                });
            const res: Response = await customFetch(endpoint, {
                method: "GET",
            });

            const resJson = await res.json();
            if (!res.ok) {
                console.error("Error loading posts. Please try again later.");
            }
            if (res.ok) {
                const result: Post[] = resJson;
                // debug home screen code (just keep it here), home screen breaks often
                // console.debug('result', result.length, 'sections', sections.length, 'page', pageNow, 'reset', reset);
                if (result.length > 0 || reset) {
                    page.current++;
                    // console.log(
                    //   'incrementing page',
                    //   pageNow,
                    //   sections.length,
                    //   result.length,
                    // );
                    // debug home screen code
                    // for (let i = 0; i < result.length; i++) {
                    //   console.debug(result[i]._id);
                    // }
                    if (reset) {
                        setCards([...result]);
                    } else setCards((cards) => [...cards, ...result]);
                } else {
                    stopped.current = true;
                    // console.log(
                    //   'stopped fetching posts',
                    //   result,
                    //   sections.length,
                    //   pageNow,
                    // );
                }
            }
        } catch (error) {
            console.error("Error loading posts. Please try again later.", error);
        }
        setLoading(false);
    };

    const renderItem: any = ({ item }: any) => {
        return (
            <View
                style={{
                    width: "70%",
                    marginBottom: 30,
                }}
            >
                  <Card issue={item} />
            </View>
        );
    };

    function renderFooter() {
      if (loading) {
        return (
          <View style={{marginVertical: 20}}>
            <ActivityIndicator size="small" color={colors.purple} />
          </View>
        );
      } else if (cards.length == 0) {
        return (
          <View style={{marginTop: 20}}>
            <Text style={{color: colors.gray, textAlign: 'center'}}>
              No posts yet
            </Text>
          </View>
        );
      } else return null;
    }

    function renderHeader() {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: colors.white,
            borderBottomColor: colors.lightlightgray,
            borderBottomWidth: 1,
          }}>
        </View>
      );
    }

    function handleEndReached() {
      if (!loading && !stopped.current && !refreshing.current) {
        fetchPosts(false);
      } else {
        // console.info(
        //   'not fetching posts',
        //   loading,
        //   stopped.current,
        //   refreshing.current,
        // );
      }
    }

    function onRefresh() {
      refreshing.current = true;
      stopped.current = false;
      fetchPosts(true);
      refreshing.current = false;
    }


    return (
      <View style={{flex: 1}}>
        <FlashList
          data={cards}
          renderItem={renderItem}
          // keyExtractor={item => Math.random().toString(36).substring(7)}
          //keyExtractor={item => item._id}
          ListHeaderComponent={renderHeader}
          indicatorStyle={colors.theme == 'dark' ? 'white' : 'black'}
          estimatedItemSize={400}
          ListFooterComponent={renderFooter}
          onEndReached={handleEndReached}
          showsVerticalScrollIndicator={true}
          onEndReachedThreshold={0.9} // increase this to render next posts earlier
          ListFooterComponentStyle={{flexGrow: 1, justifyContent: 'center'}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing.current}
              onRefresh={onRefresh}
              title="Pull to refresh"
              tintColor={colors.purple}
              titleColor={colors.purple}
            />
          }
        />
      </View>
    );
};

export default AllScreen;
