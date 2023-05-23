import { formatCurrency, getSupportedCurrencies } from "react-native-format-currency";

const formatMoney = (money, type) => {
    const [valueFormattedWithSymbol, 
            valueFormattedWithoutSymbol, symbol] = 
                formatCurrency({ amount: Number(money), code: "VND" })
    return type == 1 ? valueFormattedWithSymbol : valueFormattedWithoutSymbol;
}

export default formatMoney;