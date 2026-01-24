import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error('Uncaught error:', error, errorInfo);

        // Attempt to update loading text
        if (typeof document !== 'undefined') {
            const loadText = document.getElementById('loading-text');
            if (loadText) loadText.innerText = '應用程式崩潰';
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>應用程式發生錯誤 😱</Text>
                    <ScrollView style={styles.scroll}>
                        <Text style={styles.error}>{this.state.error && this.state.error.toString()}</Text>
                        <Text style={styles.stack}>{this.state.errorInfo && this.state.errorInfo.componentStack}</Text>
                    </ScrollView>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffe6e6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#cc0000',
    },
    scroll: {
        width: '100%',
        maxHeight: 400,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    stack: {
        fontFamily: 'monospace',
        fontSize: 12,
    }
});

export default GlobalErrorBoundary;
