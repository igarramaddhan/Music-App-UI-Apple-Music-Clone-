import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Animated,
	PanResponder,
	Dimensions,
	ScrollView,
	Image,
	Slider,
	StatusBar
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = {};

export default class App extends Component<Props> {
	state = {
		isScrollEnabled: false
	};

	componentWillMount() {
		this.scrollOffset = 0;
		this.animation = new Animated.ValueXY({ x: 0, y: SCREEN_HEIGHT - 80 });
		this.panResponder = PanResponder.create({
			onMoveShouldSetPanResponder: (evt, gestureState) => {
				if (
					(this.state.isScrollEnabled &&
						this.scrollOffset <= 0 &&
						gestureState.dy > 0) ||
					(!this.state.isScrollEnabled && gestureState.dy < 0)
				) {
					return true;
				}
			},
			onPanResponderGrant: (evt, gestureState) => {
				this.animation.extractOffset();
			},
			onPanResponderMove: (evt, gestureState) => {
				this.animation.setValue({ x: 0, y: gestureState.dy });
			},
			onPanResponderRelease: (evt, gestureState) => {
				if (gestureState.moveY > SCREEN_HEIGHT - 105) {
					Animated.spring(this.animation.y, {
						toValue: 0,
						tension: 1
					}).start();
				} else if (gestureState.moveY < 105) {
					Animated.spring(this.animation.y, {
						toValue: 0,
						tension: 1
					}).start();
				} else if (gestureState.dy < 0) {
					this.setState({ isScrollEnabled: true });
					Animated.spring(this.animation.y, {
						toValue: -SCREEN_HEIGHT + 105,
						tension: 1
					}).start();
				} else if (gestureState.dy > 0) {
					this.minimize(() => {});
				}
			}
		});
	}
	minimize(cb) {
		this.setState({ isScrollEnabled: false });
		cb && cb();
		Animated.spring(this.animation.y, {
			toValue: SCREEN_HEIGHT - 105,
			tension: 1
		}).start();
	}

	render() {
		const animatedHeight = {
			transform: this.animation.getTranslateTransform()
		};
		const animatedImageHeight = this.animation.y.interpolate({
			inputRange: [0, SCREEN_HEIGHT - 80],
			outputRange: [200, 32],
			extrapolate: 'clamp'
		});
		const animatedSongOpacity = this.animation.y.interpolate({
			inputRange: [0, SCREEN_HEIGHT - 500, SCREEN_HEIGHT - 80],
			outputRange: [0, 0, 1],
			extrapolate: 'clamp'
		});
		const animatedImageMarginLeft = this.animation.y.interpolate({
			inputRange: [0, SCREEN_HEIGHT - 80],
			outputRange: [SCREEN_WIDTH / 2 - 105, 10],
			extrapolate: 'clamp'
		});
		const animatedHeaderHeight = this.animation.y.interpolate({
			inputRange: [0, SCREEN_HEIGHT - 80],
			outputRange: [SCREEN_HEIGHT / 2, 80],
			extrapolate: 'clamp'
		});
		const animatedSongDetailOpacity = this.animation.y.interpolate({
			inputRange: [0, SCREEN_HEIGHT - 500, SCREEN_HEIGHT - 80],
			outputRange: [1, 0, 0],
			extrapolate: 'clamp'
		});
		const animatedBackgroundColor = this.animation.y.interpolate({
			inputRange: [0, SCREEN_HEIGHT - 80],
			outputRange: ['rgba(0,0,0,0.2)', 'white'],
			extrapolate: 'clamp'
		});
		return (
			<Animated.View
				style={{ flex: 1, backgroundColor: animatedBackgroundColor }}
			>
				<StatusBar
					translucent
					backgroundColor={'rgba(0,0,0,0)'}
					barStyle="dark-content"
				/>
				<View
					style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
				>
					<Text>HERE IS YOUR MUSIC</Text>
				</View>
				<Animated.View
					{...this.panResponder.panHandlers}
					style={[
						animatedHeight,
						{
							position: 'absolute',
							left: 0,
							right: 0,
							zIndex: 10,
							backgroundColor: 'white',
							height: SCREEN_HEIGHT
						}
					]}
				>
					<ScrollView
						scrollEnabled={this.state.isScrollEnabled}
						// scrollEventThrottle={16}
						onScroll={event => {
							this.scrollOffset = event.nativeEvent.contentOffset.y;
						}}
					>
						<Animated.View
							style={{
								height: animatedHeaderHeight,
								borderTopWidth: 1,
								borderTopColor: '#ebe5e5',
								flexDirection: 'row',
								alignItems: 'center'
							}}
						>
							<Animated.View
								style={{
									opacity: animatedSongDetailOpacity,
									position: 'absolute',
									top: 10,
									left: 10
								}}
							>
								<Icon
									name="chevron-down"
									size={32}
									color="black"
									onPress={() =>
										this.minimize(() => this.animation.extractOffset())
									}
								/>
							</Animated.View>
							<View
								style={{
									flex: 4,
									flexDirection: 'row',
									alignItems: 'center'
								}}
							>
								<Animated.View
									style={{
										height: animatedImageHeight,
										width: animatedImageHeight,
										marginLeft: animatedImageMarginLeft
									}}
								>
									<Image
										style={{ flex: 1, height: null, width: null }}
										source={{
											uri:
												'data:image/jpeg;base64,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'
										}}
									/>
								</Animated.View>
								<Animated.Text
									style={{
										opacity: animatedSongOpacity,
										fontSize: 18,
										paddingLeft: 10,
										color: 'black'
									}}
								>
									Nightmare
								</Animated.Text>
							</View>
							<Animated.View
								style={{
									opacity: animatedSongOpacity,
									flex: 1,
									flexDirection: 'row',
									justifyContent: 'space-around'
								}}
							>
								<Icon name="pause" size={32} color="black" />
								<Icon name="play" size={32} color="black" />
							</Animated.View>
						</Animated.View>
						<Animated.View
							style={{
								height: animatedHeaderHeight,
								opacity: animatedSongDetailOpacity
							}}
						>
							<View
								style={{
									flex: 1,
									alignItems: 'center',
									justifyContent: 'flex-end'
								}}
							>
								<Text
									style={{ fontSize: 22, fontWeight: 'bold', color: 'black' }}
								>
									Nightmare
								</Text>
								<Text
									style={{ fontSize: 18, fontWeight: 'bold', color: '#fa95ed' }}
								>
									Polyphia
								</Text>
							</View>
							<View
								style={{
									height: 40,
									width: SCREEN_WIDTH,
									alignItems: 'center'
								}}
							>
								<Slider
									style={{ width: 300 }}
									step={1}
									minimumValue={18}
									maximumValue={71}
									value={18}
									thumbTintColor="black"
								/>
							</View>
							<View
								style={{
									flex: 1,
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-around'
								}}
							>
								<Icon name="rewind" size={40} color="black" />
								<Icon name="pause" size={50} color="black" />
								<Icon name="fast-forward" size={40} color="black" />
							</View>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
									paddingHorizontal: 20,
									paddingBottom: 20
								}}
							>
								<Icon name="plus" size={32} color="black" />
								<Icon name="dots-vertical" size={32} color="black" />
							</View>
						</Animated.View>
						<View style={{ height: 1050 }} />
					</ScrollView>
				</Animated.View>
			</Animated.View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFFFFF'
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5
	}
});
