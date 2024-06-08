import Animated, { Easing, FadeInUp, FadeOutUp, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { CarouselText } from './CarouselText';
import { Dimensions, StyleSheet } from 'react-native';

interface CarouselProps {
    data: any[];
    itemSize?: number;
    setter: Function
}

const {width, height} = Dimensions.get('window');

export function Carousel({data, itemSize = width/2.5, setter}: CarouselProps) {
    const scrollX = useSharedValue(0);

    const bounceInAnim = FadeInUp.duration(450).easing(Easing.elastic(3)).withInitialValues({opacity: 0, transform: [{translateY: -50}]})
    const fadeOutAnim = FadeOutUp.duration(450).easing(Easing.elastic())

    const scrollHandler = useAnimatedScrollHandler((e) => {
        scrollX.value = e.contentOffset.x;
    })

    return (
        <Animated.FlatList
          // entering={bounceInAnim}
          // exiting={fadeOutAnim}
          data={data}
          keyExtractor={item => item.toString()}
          style={styles.timerWrapper}
          contentContainerStyle={{
            alignItems: 'center',
            // paddingRight: ITEM_SIZE * 2
            paddingRight: itemSize * 1.5
          }}
          
          // onScroll={e => {
          //   scrollX.value = e.nativeEvent.contentOffset.x
          // }}
          onScroll={scrollHandler}
          onMomentumScrollEnd={e => {
            const index = Math.round(scrollX.value / itemSize);
            const newValue = data[index];
            if(newValue) {
              setter(newValue)
            }
            // console.log({newValue})
          }}
          // decelerationRate={0}
          pagingEnabled={true}
          snapToInterval={itemSize}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          bounces={false}
          renderItem={({item, index}) => {
            return (
              <CarouselText scrollX={scrollX} val={item} itemSize={itemSize} index={index} />
            )
          }}
        />
    )
}


const styles = StyleSheet.create({
    timerWrapper: {
        flex: 1,
        backgroundColor: '#000',
        borderRadius: 8,
        overflow: 'hidden'
    },
})