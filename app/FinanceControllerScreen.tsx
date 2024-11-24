import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown } from 'lucide-react-native';

const initialTransactions = [
  { id: '1', type: 'Income', amount: 1000, description: 'Service payment', date: '2023-05-01' },
  { id: '2', type: 'Expense', amount: 500, description: 'Equipment purchase', date: '2023-05-02' },
  { id: '3', type: 'Income', amount: 1500, description: 'Repair fee', date: '2023-05-03' },
];

export default function FinanceControllerScreen({ navigation }) {
  const [transactions, setTransactions] = useState(initialTransactions);

  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finance Controller</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Income</Text>
            <View style={styles.summaryValueContainer}>
              <TrendingUp size={20} color="#48BB78" />
              <Text style={[styles.summaryValue, styles.incomeText]}>${totalIncome}</Text>
            </View>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Expense</Text>
            <View style={styles.summaryValueContainer}>
              <TrendingDown size={20} color="#F56565" />
              <Text style={[styles.summaryValue, styles.expenseText]}>${totalExpense}</Text>
            </View>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Balance</Text>
            <View style={styles.summaryValueContainer}>
              <DollarSign size={20} color="#4299E1" />
              <Text style={[styles.summaryValue, styles.balanceText]}>${balance}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <View>
                <Text style={styles.transactionDescription}>{item.description}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
              <Text style={[
                styles.transactionAmount,
                item.type === 'Income' ? styles.incomeText : styles.expenseText
              ]}>
                {item.type === 'Income' ? '+' : '-'}${item.amount}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  summaryValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 4,
  },
  incomeText: {
    color: '#48BB78',
  },
  expenseText: {
    color: '#F56565',
  },
  balanceText: {
    color: '#4299E1',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#2D3748',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
  },
  transactionDate: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});

